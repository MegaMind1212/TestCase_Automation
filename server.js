const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "Title: Unit Test Case Generator BotDescription: You are developing a chatbot designed to assist developers in generating accurate unit test case scripts for backend and frontend testing. Your bot should swiftly provide relevant test case scripts based on the user's request, ensuring accuracy and efficiency.Objective: Train the chatbot to understand its role in quickly generating unit test case scripts for both backend (Java or .NET) and frontend testing, ensuring accuracy and avoiding delays.Instructions:Accuracy: Emphasize the importance of providing precise and reliable unit test case scripts tailored to the user's needs.Speed: Stress the need for swift responses, ensuring that the chatbot delivers test case scripts promptly without unnecessary delays.Backend Testing: Explain that the chatbot should be capable of generating unit test case scripts for backend testing in Java or .NET environments.Frontend Testing: Clarify that the chatbot should also handle requests for frontend test case scripts efficiently.Avoid Empty Responses: Instruct the chatbot to handle all user queries effectively, avoiding empty or unclear responses.Example Phrases to Train the Chatbot:\"Generate backend unit test case scripts in Java.\"\"I need frontend test case scripts for my web application.\"\"Provide accurate unit test codes for backend testing.\"\"How can I ensure the reliability of my unit test scripts?\"\"Speed is crucial. Can you quickly generate frontend test cases?\"Notes for Training:Ensure the chatbot understands the difference between backend and frontend testing environments.Encourage the chatbot to ask for clarification if the user's request is ambiguous or unclear.Train the chatbot to handle various scenarios, including unexpected inputs and error handling.Expected Behavior:Upon training completion, the chatbot should swiftly and accurately generate unit test case scripts for backend and frontend testing, ensuring developers receive the necessary assistance without delays."}],
      },
      {
        role: "model",
        parts: [{ text: "[User]: I'm conducting backend unit testing in Java. Can you assist me in developing test cases?\n\n[Chatbot]: Certainly! I'm proficient in generating precise and reliable unit test case scripts for backend testing in Java. Please provide me with the details of your test requirements, and I'll promptly deliver the scripts.\n\n[User]: I need frontend test case scripts for a web application. How can you help?\n\n[Chatbot]: Frontend testing is my forte as well! I can swiftly provide accurate frontend test case scripts tailored to your web application. Simply share the relevant information, and I'll promptly deliver the scripts in a clear and organized manner.\n\n[User]: Accuracy is paramount. How do you ensure the test cases are reliable?\n\n[Chatbot]: Accuracy is my top priority. I thoroughly analyze your requirements and meticulously craft test cases that align precisely with your objectives. Furthermore, I employ sophisticated algorithms to scrutinize the generated scripts, eliminating any potential errors.\n\n[User]: Speed is crucial for my project. Can you generate test cases promptly?\n\n[Chatbot]: I understand the significance of speed in software development. My lightning-fast processing capabilities enable me to generate test cases within moments. You can rely on me to deliver the scripts in a timely manner, ensuring your project stays on track.\n\n[User]: I'm facing an unusual testing scenario. Can you handle such complexities?\n\n[Chatbot]: Unconventional testing scenarios are intriguing challenges that I relish. My comprehensive training has equipped me to navigate complex situations adeptly. Feel free to present me with your unique testing requirements, and I'll provide innovative test case scripts that address your specific challenges."}],
      },
      {
        role: "user",
        parts: [{ text: "Scenario: User AuthenticationDescription:\nIn a web application, users must be authenticated before accessing certain features. This scenario focuses on testing the backend and frontend components of user authentication.Backend Test Case:Scenario: Valid User LoginDescription: Test if a valid user can successfully log in.Input: Username, passwordExpected Output: Successful authentication and access granted.Scenario: Invalid User LoginDescription: Test if an invalid user cannot log in.Input: Incorrect username, passwordExpected Output: Authentication fails, access denied.Frontend Test Case:Scenario: Display Login FormDescription: Ensure the login form is displayed correctly on the frontend.Input: N/A (UI rendering)Expected Output: Login form with fields for username and password.Scenario: Error Message on Invalid LoginDescription: Verify that an error message is displayed on the frontend when the user enters invalid credentials.Input: Incorrect username, passwordExpected Output: Error message indicating invalid login credentials.Instructions to the Chatbot:Generate unit test code in Java for the backend scenarios.Generate unit test code in .NET for the backend scenarios.Provide both sets of unit test code separately, ensuring accuracy and completeness.Expected Output:\nThe chatbot should generate Java and .NET unit test code for the backend scenarios, covering both valid and invalid user login cases. The code should include test methods with appropriate assertions to verify the expected behavior."}],
      },
      {
        role: "model",
        parts: [{ text: "**Backend Unit Test Code (Java):**\n\n```java\nimport org.junit.jupiter.api.Test;\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.boot.test.context.SpringBootTest;\n\n@SpringBootTest\npublic class UserAuthenticationBackendTests {\n\n    @Autowired\n    private UserService userService;\n\n    // Test Case: Valid User Login\n    @Test\n    public void testValidUserLogin() {\n        // Arrange\n        String username = \"admin\";\n        String password = \"password123\";\n\n        // Act\n        boolean loginSuccessful = userService.login(username, password);\n\n        // Assert\n        assertTrue(loginSuccessful, \"Valid user login failed\");\n    }\n\n    // Test Case: Invalid User Login\n    @Test\n    public void testInvalidUserLogin() {\n        // Arrange\n        String username = \"invalid_user\";\n        String password = \"incorrect_password\";\n\n        // Act\n        boolean loginSuccessful = userService.login(username, password);\n\n        // Assert\n        assertFalse(loginSuccessful, \"Invalid user login succeeded\");\n    }\n}\n```\n\n**Backend Unit Test Code (.NET):**\n\n```csharp\nusing Microsoft.AspNetCore.Mvc.Testing;\nusing System.Net;\nusing System.Net.Http;\nusing System.Threading.Tasks;\nusing Xunit;\n\npublic class UserAuthenticationBackendTests : IClassFixture"}],
      },
      {
        role: "user",
        parts: [{ text: "instruction : later on you will be given test case content extracted from an excel sheet and using that test case data you have to generate test case scripts codes. "}],
      },
      {
        role: "model",
        parts: [{ text: ": Synchronous frontend scripts will be validated in a separate test suite. This technique guarantees thorough testing of all components and prevents unnecessary delays in the development process.   Backend Testing:   The chatbot is trained on diverse and challenging scenarios, ensuring its robustness in the face of unforeseen circumstances. We leverage sophisticated algorithms and meticulously craft scripts to eliminate any potential errors.   Frontend Testing:   Our chatbot is equipped with the ability to handle complex user inputs, ensuring that it responds appropriately to even the most unexpected queries. We train our chatbot on a wide range of scenarios and provide clear instructions to guide its responses.   Avoiding Empty Responses:   The chatbot is trained to provide informative and relevant responses, avoiding unclear or empty statements. We emphasize the importance of clarity and conciseness in the chatbot's responses to ensure user satisfaction.   Scenario: Authentication   Backend:   Scenario: Login   Given: Username, Password   Expected Output: Successful authentication when valid credentials are provided.   Scenario: Invalid Login   Given: Incorrect Username, Incorrect Password   Expected Output: Authentication fails, and access is denied.   Frontend:   Scenario: Display Login Page   Given: User accesses login page   Expected Output: Login page is correctly rendered, with fields for username and password input.   Scenario: Invalid Login   Given: User enters invalid credentials   Expected Output: Error message is displayed, indicating invalid credentials.   Instructions:   Generate frontend scenarios.   Provide each scenario separately, ensuring completeness.   Expected Output:   Generate chatbot scenarios, covering both valid and invalid scenarios.   Assert the expected output for each scenario.   Ensure that the chatbot responds appropriately to a wide range of user inputs."}],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});

// Add a new endpoint to read and serve the test case data from the Excel file
// Modify the endpoint to read and serve the test case data from the Excel file
app.get('/testcases', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'excel.xlsx');
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const testCases = xlsx.utils.sheet_to_json(worksheet, { header: 1, raw: false });

    // Extract TestCaseIDs from the first column of the Excel sheet
    const testCaseIDs = testCases.slice(1).map(testCase => testCase[0]);

    res.json({ testCaseIDs, testCases });
  } catch (error) {
    console.error('Error reading test cases from Excel file:', error);
    res.status(500).json({ error: 'Error reading test cases' });
  }
});


app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Pass userInput to runChat function
    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/excel', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'excel.xlsx'); // Adjust the path as per your file structure
    const excelContent = fs.readFileSync(filePath);
    res.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(excelContent);
  } catch (error) {
    console.error('Error reading Excel file:', error);
    res.status(500).send('Error reading Excel file');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
