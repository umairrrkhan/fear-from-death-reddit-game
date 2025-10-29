# Design Document: Dino-Guess Multiplayer Trivia Game

## Overview

Dino-Guess is a real-time multiplayer trivia game built on the Reddit Devvit platform. The system implements a turn-based combat mechanism where two players compete through 5 rounds of dinosaur-themed questions, with faster correct answers dealing damage to opponents. The architecture leverages Devvit's serverless endpoints and Redis for state management to create a seamless multiplayer experience within Reddit posts.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Reddit Post   │    │   Reddit Post   │
│   (Player 1)    │    │   (Player 2)    │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          │   HTTP Requests      │
          │                      │
    ┌─────▼──────────────────────▼─────┐
    │        Devvit Server             │
    │     (Express Endpoints)          │
    └─────────────┬────────────────────┘
                  │
                  │ Redis Operations
                  │
    ┌─────────────▼────────────────────┐
    │         Redis Store              │
    │    (Game State & Sessions)       │
    └──────────────────────────────────┘
```

### System Components

1. **Client Application**: React-based UI running in Reddit webview
2. **Server API**: Express endpoints handling game logic and state
3. **Redis Store**: Persistent storage for game sessions and player data
4. **Game Engine**: Core logic for trivia mechanics and combat system
5. **Matchmaking Service**: Player pairing and session management

## Components and Interfaces

### Client Components

#### GameLobby Component
- **Purpose**: Player registration and dinosaur selection
- **State**: Available dinosaurs, player selection, matchmaking status
- **Props**: `onPlayerReady(playerId, dinosaurId)`
- **Interactions**: Calls `/api/join-game` endpoint

#### GameBattle Component
- **Purpose**: Main game interface during trivia rounds
- **State**: Current question, player health, timer, round number
- **Props**: `gameSession, currentPlayer, onAnswerSubmit`
- **Interactions**: Calls `/api/submit-answer` and `/api/get-game-state`

#### HealthBar Component
- **Purpose**: Visual representation of player health
- **Props**: `currentHealth, maxHealth, playerTheme`
- **Styling**: Red theme for Player 1, Blue theme for Player 2

#### QuestionCard Component
- **Purpose**: Display trivia question with multiple choice answers
- **Props**: `question, answers, timeRemaining, onAnswerSelect`
- **Features**: 15-second countdown timer, answer selection

#### ResultsScreen Component
- **Purpose**: End-game results and replay option
- **Props**: `winner, finalScores, gameStats`
- **Actions**: Replay button calling `/api/create-game`

### Server API Endpoints

#### POST /api/create-game
- **Purpose**: Initialize new game session
- **Request**: `{ postId: string }`
- **Response**: `{ gameId: string, status: 'waiting' }`
- **Logic**: Creates Redis entry for game session

#### POST /api/join-game
- **Purpose**: Player joins existing game
- **Request**: `{ gameId: string, playerId: string, dinosaurId: string }`
- **Response**: `{ success: boolean, playerNumber: number, gameState: GameState }`
- **Logic**: Adds player to session, starts game when 2 players joined

#### POST /api/submit-answer
- **Purpose**: Process player answer submission
- **Request**: `{ gameId: string, playerId: string, answerId: string, responseTime: number }`
- **Response**: `{ correct: boolean, damage: number, newHealth: number, gameState: GameState }`
- **Logic**: Validates answer, calculates damage, updates game state

#### GET /api/game-state/:gameId
- **Purpose**: Retrieve current game state
- **Response**: `GameState` object
- **Logic**: Fetches from Redis with real-time updates

#### POST /api/handle-disconnect
- **Purpose**: Manage player disconnections
- **Request**: `{ gameId: string, playerId: string }`
- **Response**: `{ botSubstituted: boolean, gameState: GameState }`
- **Logic**: Activates bot player, maintains game flow

### Core Interfaces

```typescript
interface GameState {
  gameId: string;
  status: 'waiting' | 'active' | 'completed';
  players: Player[];
  currentRound: number;
  currentQuestion: Question | null;
  roundStartTime: number;
  winner: string | null;
}

interface Player {
  id: string;
  username: string;
  dinosaurId: string;
  health: number;
  isBot: boolean;
  connected: boolean;
  theme: 'red' | 'blue';
}

interface Question {
  id: string;
  text: string;
  answers: Answer[];
  correctAnswerId: string;
  category: string;
}

interface Answer {
  id: string;
  text: string;
}

interface DamageCalculation {
  baseDamage: number;
  speedBonus: number;
  totalDamage: number;
}
```

## Data Models

### Redis Data Structure

#### Game Sessions
```
Key: game:{gameId}
Value: {
  gameId: string,
  postId: string,
  status: 'waiting' | 'active' | 'completed',
  players: Player[],
  currentRound: number,
  currentQuestion: Question,
  roundStartTime: number,
  createdAt: number,
  updatedAt: number
}
TTL: 1 hour
```

#### Player Sessions
```
Key: player:{playerId}:game:{gameId}
Value: {
  playerId: string,
  gameId: string,
  health: number,
  answers: AnswerRecord[],
  totalDamageDealt: number,
  averageResponseTime: number
}
TTL: 1 hour
```

#### Question Bank
```
Key: questions:dinosaur
Value: Question[]
```

### Question Bank Structure

Questions organized by difficulty and category:
- **Species Identification**: Basic dinosaur recognition
- **Time Periods**: Mesozoic era, Triassic, Jurassic, Cretaceous
- **Characteristics**: Size, diet, habitat, physical features
- **Paleontology**: Fossil discoveries, scientific facts

Minimum 50 questions with balanced difficulty distribution.

## Error Handling

### Client-Side Error Handling

1. **Network Failures**: Retry mechanism with exponential backoff
2. **Invalid Game State**: Redirect to lobby with error message
3. **Disconnection**: Show reconnection dialog with 60-second countdown
4. **Timeout Errors**: Graceful degradation with offline mode

### Server-Side Error Handling

1. **Redis Connection Failures**: Return cached state or error response
2. **Invalid Game Operations**: Validate state before processing
3. **Player Disconnections**: Automatic bot substitution
4. **Concurrent Modifications**: Optimistic locking with retry logic

### Error Response Format

```typescript
interface ErrorResponse {
  error: true;
  code: string;
  message: string;
  details?: any;
}
```

## Testing Strategy

### Unit Testing

- **Game Logic**: Question validation, damage calculation, health management
- **State Management**: Redis operations, game state transitions
- **API Endpoints**: Request/response validation, error handling
- **Components**: React component rendering, user interactions

### Integration Testing

- **Client-Server Communication**: API endpoint integration
- **Redis Operations**: Data persistence and retrieval
- **Game Flow**: Complete game session from lobby to results
- **Multiplayer Scenarios**: Two-player interactions, bot substitution

### End-to-End Testing

- **Complete Game Sessions**: Full multiplayer game flow
- **Disconnection Handling**: Player disconnect and reconnect scenarios
- **Performance Testing**: Multiple concurrent games
- **Reddit Integration**: Devvit platform compatibility

### Testing Tools

- **Vitest**: Unit and integration testing framework
- **React Testing Library**: Component testing
- **Supertest**: API endpoint testing
- **Redis Mock**: Redis operations testing

## Performance Considerations

### Client Optimization

- **Component Memoization**: Prevent unnecessary re-renders
- **Lazy Loading**: Load components on demand
- **State Management**: Minimize API calls with local state caching
- **Asset Optimization**: Compress SVG dinosaur avatars

### Server Optimization

- **Redis Connection Pooling**: Efficient database connections
- **Response Caching**: Cache static content like questions
- **Request Validation**: Early validation to prevent processing overhead
- **Concurrent Request Handling**: Optimize for multiple simultaneous games

### Scalability

- **Stateless Endpoints**: Enable horizontal scaling
- **Redis Clustering**: Support for high-volume concurrent games
- **Question Bank Management**: Efficient random question selection
- **Session Cleanup**: Automatic cleanup of expired game sessions

## Security Considerations

### Data Validation

- **Input Sanitization**: Validate all client inputs
- **Answer Verification**: Server-side answer validation
- **Rate Limiting**: Prevent spam submissions
- **Session Validation**: Verify player authorization

### Game Integrity

- **Anti-Cheating**: Server-side timing validation
- **State Consistency**: Atomic Redis operations
- **Player Authentication**: Leverage Devvit's built-in auth
- **Data Encryption**: Secure sensitive game data

## Deployment Architecture

### Devvit Platform Integration

- **Client Bundle**: Optimized React build in `dist/client`
- **Server Bundle**: Express app compiled to `dist/server`
- **Asset Management**: SVG dinosaurs in `assets/` directory
- **Configuration**: Devvit.json with proper permissions

### Environment Configuration

- **Development**: Local testing with `npm run dev`
- **Staging**: Devvit playtest environment
- **Production**: Reddit's hosted infrastructure
- **Monitoring**: Built-in Devvit logging and metrics
