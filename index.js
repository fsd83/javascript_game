const prompt = require('prompt-sync')({ sigint: true});


// Applying colours into the game text using chalk ver.4
const chalk = require("chalk");                                                   // declaring chalk as require for the colour scheme into the text

// Constant Game Elements
const HAT = chalk.yellow('^');                                                    //  declaring ^ as hat and apply chalk yellow colour
const HOLE = chalk.red('O');                                                      //  declaring O as trap Hole and apply chalk red colour 
const GRASS = chalk.green('░');                                                   //  declaring ░ as GRASS and apply chalk green colour
const PLAYER = chalk.cyan('*');                                                   //  declaring * as Player and apply chalk cyan colour

// Constants Game Scenarios (Messages)
const WIN = chalk.green.bold("Congratulations! You win!");                         // WIN with chalk green colour & bold text
const LOSE = chalk.bgRed("You lose!");                                             // LOSE with chalk bgRed (background Colour Red) 
const OUT_BOUND = chalk.bgRed("Ops! You drop out of the field!");                  // Drop out of the field with chalk bgRed (background Colour Red)        
const INTO_HOLE =chalk.bgRed("You fell into a hole");                              // Fell into the hold with chalk bgRed (background Colour Red)
const WELCOME = chalk.yellow("Welcome to Find Your Hat game");                     // Welcome with chalk yellow colour
const DIRECTION = "Which direction, up(u), down(d), left(l) or right(r)?";         // Keyboard Direction
const QUIT = "Press q or Q to quit the game.";                                     // Keyboard to end the game
const END_GAME = chalk.yellow("Thanks for playing.");                              // Ended the game
const NOT_RECOGNISED =  chalk.bgMagenta("Wrong Direction Key.");                   // Input not recpgnize 


class Field {

    constructor(rows, cols) {
        this.rows = rows;                                                       // property to set up the number of rows for the field
        this.cols = cols;                                                       // property to set up the number of cols for the field
        this.field =  new Array([]);                                            // property that represents the field for game
        this.gamePlay = false;                                                  // property to setup the game play
        this.playerPos = {
            row: 0,
            col: 0
        };                                                                      // track the player position
        this.difficulty = 1;                                                    // default difficulty level

    }


    // Static method to get difficulty from user
    static getDifficulty(){
        console.log(chalk.cyan.bold("Select Your Level!"));                  
        console.log(chalk.green("1: Kiddo Mode"));                           // Kiddo mode = 10x10
        console.log(chalk.yellow("2: Amateur Mode"));                        // Amateur Mode = 20x20
        console.log(chalk.red("3: Salute Mode" ));                           // Salute Mode = 30x30
        console.log(chalk.white("q: To Quit" ));                          

        let userInput = prompt("Enter Your Choice: ");                      // Prompting user to input the game level selection
        let fieldSize = 0;

        const input = userInput.toLocaleLowerCase();                        // Covert input to lowercases                
    
        switch(userInput){
            case "1":
                console.log(chalk.green("Kiddo Mode Selected!"));
                fieldSize =10;
                break;
            case "2":
                console.log(chalk.yellow("Amateur Mode Selected!"));
                fieldSize =20;
                break;
            case "3":
                console.log(chalk.red("Salute Mode Selected!"));
                fieldSize =30;
                break;
            case "q":
                console.log(chalk.magenta("You chicken OUT?"));
                console.log(END_GAME);  // Fixed typo: End_Game to END_GAME
                process.exit();  // Exit the game if user chooses to quit
                break;
            default:
                console.log(NOT_RECOGNISED);
                // console.log(End_Game);
                // process.exit();
                break;

        }
       
         return fieldSize;
    
    }



    // set the difficulty level
    setDifficulty(level) {
        this.difficulty = level;
    }

    // methods

    // Welcome Message
    static welcomeMsg(msg) {
        const border = chalk.cyan("**********************************************");  // declaring * has border line for the welcome msg
        console.log(
            "\n" + border + "\n" +
            msg 
            + "\n" + border + "\n"
            
        );
    }


    // Randomise the field with HAT, HOLE and GRASS
    generateField() {
        // First, fill the field with grass
        for (let i = 0; i < this.rows; i++) {
            this.field[i] = new Array();
            for (let j = 0; j < this.cols; j++) {
                this.field[i][j] = GRASS;
            }
        }

        // Place the player at the starting position
        this.field[0][0] = PLAYER;
        this.playerPos.row = 0;
        this.playerPos.col = 0;

        // Place the hat in a random position (not at the start)
        let hatRow, hatCol;
        do {
            
            hatRow = Math.floor(Math.random() * this.rows);
            hatCol = Math.floor(Math.random() * this.cols);
        }while (hatRow === 0 && hatCol === 0);
        
        this.field[hatRow][hatCol] = HAT;

        // Add holes - percentage changes with difficulty
        let holePercentage;


        // Set hole density based on difficultly
        switch(this.difficulty){
            case 1: // Easy
                holePercentage = 0.1;
            break;
            case 1: // Normal
                holePercentage = 0.25;
            break;
            case 1: // Expert
                holePercentage = 0.35;
            break;
            default:
                holePercentage = 0.25;
        }

        for (let i =0; i < this.rows; i++){
            for(let j=0; j <this.cols; j++) {
                // Skip player position and hat position
                if ((i === 0 && j ===0 ) || ( i === hatRow && j ===hatCol)) { 
                    continue;
                }
                

                // Ensure the first row and column have fewer holes to allow player movement
                let chance = holePercentage;
                    if(i === 0 || j === 0) {
                        chance = holePercentage * 0.4; // Reduced chance for first row and column
                    }

                    if (Math.random() < chance) {
                        this.field[i][j] = HOLE;

                    }
                }

            }
        }

      
    // Print the game field
    printField() {
        this.field.forEach((element) => {
            console.log(element.join(""));
        });
    }

    // Start game
    startGame() {
        this.gamePlay = true;
        this.generateField();                                           // Generate the field firs
        this.printField();                                              // Print the field once
        this.updateGame();                                              // Update the game once
    }

    // Handle game updates
    updateGame() {                                                      // Update the game
        let userInput = "";                                             // Obtain user input

        // Display the direction option
        do {
            console.log(DIRECTION + " " + QUIT);                        // Request user for the input
            userInput = prompt();                                       //  Get the user's input

            switch (userInput.toLowerCase()) {
                case "u":
                    console.log(chalk.bgMagenta("Moved Up!"));          // Display user selected input "u" & text with background colour           
                    this.updatePlayer(userInput.toLowerCase());
                    break;
                case "d":
                    console.log(chalk.bgMagenta("Moved Down!"));        // Display user selected input "d" & text with background colour     
                    this.updatePlayer(userInput.toLowerCase());
                    break;
                case "l":
                    console.log(chalk.bgMagenta("Moved Left!"));        // Display user selected input "l" & text with background colour     
                    this.updatePlayer(userInput.toLowerCase());
                    break;
                case "r":
                    console.log(chalk.bgMagenta("Moved Right!"));       // Display user selected input "r" & text with background colour     
                    this.updatePlayer(userInput.toLowerCase());
                    break;
                case "q":
                    console.log(chalk.bgMagenta("End Game!"));          // Display user selected input "q" & text with background colour     
                    this.endGame();
                    break;
                default:
                    console.log(NOT_RECOGNISED);                        // Display user selected input not recognised     
                    break;
            }
            if (this.gamePlay) {
                this.printField();                                      // Print field if game is still active
        }

        } while (userInput.toLowerCase() !== "q" && this.gamePlay);    // Continue to loop if the player hasn't quit or game isn't over
    }

    // End game
    endGame() {
        console.log(END_GAME);                                       // Inform the user the game has ended
        this.gamePlay = false;                                       // set gamePlay to false
        process.exit();                                              // Quit the program
    } 

    // Update player position and game state
    updatePlayer(position) {
        // let { row, col } = this.playerPos;

        const currentRow = this.playerPos.row;
        const currentCol = this.playerPos.col;

        let newRow = currentRow;
        let newCol = currentCol;

        switch (position) {
            case "u": // Up
                newRow--;
                break;
            case "d": // Down
                newRow++;
                break;
            case "l": // Left
                newCol--;
                break;
            case "r": // Right
                newCol++;
                break;
        }
        
            
        // Check what's at the new position
        if (newRow < 0 || newRow >= this.rows || newCol < 0 || newCol >= this.cols) {
            console.log(OUT_BOUND);
            console.log(LOSE);
            this.gamePlay = false;
            return;
        }

        // Check what's at the new position
        const newPosition = this.field[newRow][newCol];

        if (newPosition === HOLE) {
            // Player fell into a hole
            console.log(INTO_HOLE);
            console.log(LOSE);
            this.gamePlay = false;
            return;
        } else if (newPosition === HAT) {
            // Player found the hat
            console.log(WIN);
            this.gamePlay = false;
            return;
        }

        // Update the field and player position
        this.field[currentRow][currentCol] = GRASS;                     // Replace old position with grass
        this.field[newRow][newCol] = PLAYER;                            // Place player at new position
        
        // Update player position tracking
        this.playerPos.row = newRow;
        this.playerPos.col = newCol;

    }
}


// Static method to welcome the player
Field.welcomeMsg(WELCOME);

// Get difficulty level and field size
const fieldSize = Field.getDifficulty();
const difficultyLevel = fieldSize / 10; // 1 for easy, 2 for normal, 3 for expert

// Create field with the selected size
const field = new Field(fieldSize, fieldSize);
field.setDifficulty(difficultyLevel);
field.startGame();                                                      // Start the game
