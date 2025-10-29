# Requirements Document

## Introduction

Dino-Guess is a real-time multiplayer dinosaur-themed trivia game built for the Reddit Devvit platform. The system enables two players to compete head-to-head in 5 rounds of trivia questions, where faster correct answers deal damage to opponents in a health-based combat system.

## Glossary

- **Dino_Guess_System**: The complete multiplayer trivia game application
- **Game_Session**: A single match between two players consisting of 5 trivia rounds
- **Player**: A Reddit user participating in the game
- **Trivia_Round**: A single question-answer cycle within a game session
- **Health_System**: The combat mechanism where players have health points that decrease when opponents answer correctly
- **Matchmaking_System**: The automated system that pairs two players for a game session
- **Question_Bank**: The collection of dinosaur-themed trivia questions
- **Response_Timer**: The countdown mechanism for each trivia question
- **Damage_Calculator**: The system component that determines damage based on answer speed and correctness

## Requirements

### Requirement 1

**User Story:** As a Reddit user, I want to join a dinosaur trivia game, so that I can compete against another player in real-time.

#### Acceptance Criteria

1. WHEN a Player accesses the game post, THE Dino_Guess_System SHALL display a lobby interface with available dinosaur characters
2. WHEN a Player selects a dinosaur character, THE Dino_Guess_System SHALL register the player for matchmaking
3. WHEN two Players have joined the lobby, THE Dino_Guess_System SHALL automatically start a Game_Session
4. IF only one Player joins within 30 seconds, THEN THE Dino_Guess_System SHALL provide a bot opponent
5. THE Dino_Guess_System SHALL support exactly 2 players per Game_Session

### Requirement 2

**User Story:** As a player, I want to answer trivia questions quickly and accurately, so that I can deal damage to my opponent and win the match.

#### Acceptance Criteria

1. WHEN a Trivia_Round begins, THE Dino_Guess_System SHALL display a dinosaur-themed question with 4 multiple choice answers
2. WHEN a Player selects an answer, THE Dino_Guess_System SHALL record the response time and correctness
3. WHEN a Player answers correctly, THE Damage_Calculator SHALL calculate damage based on response speed
4. THE Response_Timer SHALL limit each question to 15 seconds maximum
5. WHEN the Response_Timer expires, THE Dino_Guess_System SHALL treat unanswered questions as incorrect

### Requirement 3

**User Story:** As a player, I want to see my health and my opponent's health during the game, so that I can track the battle progress.

#### Acceptance Criteria

1. WHEN a Game_Session starts, THE Health_System SHALL initialize both players with 100 health points
2. WHEN a Player receives damage, THE Health_System SHALL reduce their health points accordingly
3. THE Dino_Guess_System SHALL display both players' current health in real-time
4. WHEN a Player's health reaches 0 or below, THE Dino_Guess_System SHALL declare the opponent as winner
5. THE Health_System SHALL apply damage only when the attacking player answers correctly

### Requirement 4

**User Story:** As a player, I want to complete exactly 5 rounds of questions, so that I have a fair and time-bounded competition.

#### Acceptance Criteria

1. THE Dino_Guess_System SHALL conduct exactly 5 Trivia_Rounds per Game_Session
2. WHEN all 5 rounds are completed, THE Dino_Guess_System SHALL determine the winner based on remaining health
3. WHEN a Game_Session ends, THE Dino_Guess_System SHALL display final results and winner declaration
4. THE Dino_Guess_System SHALL provide a replay option after each completed Game_Session
5. WHILE a Game_Session is active, THE Dino_Guess_System SHALL track the current round number

### Requirement 5

**User Story:** As a player, I want the game to handle disconnections gracefully, so that technical issues don't ruin the gaming experience.

#### Acceptance Criteria

1. WHEN a Player disconnects during a Game_Session, THE Dino_Guess_System SHALL substitute a bot opponent
2. THE Dino_Guess_System SHALL continue the Game_Session with the bot maintaining the disconnected player's current health
3. WHEN a Player reconnects within 60 seconds, THE Dino_Guess_System SHALL restore their control
4. IF a Player does not reconnect within 60 seconds, THEN THE Dino_Guess_System SHALL complete the session with bot control
5. THE Dino_Guess_System SHALL notify the remaining player when opponent disconnection occurs

### Requirement 6

**User Story:** As a player, I want to see a clean and intuitive interface, so that I can focus on answering questions without confusion.

#### Acceptance Criteria

1. THE Dino_Guess_System SHALL display the interface with a white background (#FFFFFF)
2. THE Dino_Guess_System SHALL use red theme colors for Player 1 and blue theme colors for Player 2
3. THE Dino_Guess_System SHALL present questions and answers in a card-based layout
4. THE Dino_Guess_System SHALL display simple SVG dinosaur avatars for each player
5. THE Dino_Guess_System SHALL maintain consistent visual styling throughout all game phases

### Requirement 7

**User Story:** As a player, I want access to varied dinosaur trivia content, so that each game feels fresh and educational.

#### Acceptance Criteria

1. THE Question_Bank SHALL contain at least 50 unique dinosaur-themed trivia questions
2. THE Dino_Guess_System SHALL randomly select 5 questions from the Question_Bank for each Game_Session
3. THE Dino_Guess_System SHALL ensure no duplicate questions within a single Game_Session
4. THE Dino_Guess_System SHALL provide 4 multiple choice answers for each question
5. THE Question_Bank SHALL include questions covering dinosaur species, periods, characteristics, and paleontology facts
