# FormBase - React Native Form Builder

**Student ID:** s46971733

## Description

FormBase is a React Native form builder designed to handle a variety of form types including:

- Text Input
- Multiline Text
- Dropdown Selection
- Location Data
- Image Uploads

FormBase makes it easy to build and maintain forms in mobile applications without repetitive code. 

## Setting Up

1. **Download the Project**  

  Download or clone the project repository and navigate to the project folder in your terminal:

  ```bash
  cd [project-directory]
  ```

2. **Install Dependencies**

  Install the required packages for React Native and Expo:

  ```bash
  npm install
  ```

3. **Running the Application**

  Start the project using Expo:

  ```bash
  npx expo start
  ```

  Use a connected device, emulator or the Expo Go app to view the application.

## Teaching Code Use

Lecture Slides and Tutorial Code from the **COMP2140 Team** were utilised to:

- Create the Location Component of the form.
- Create the Image Picker Component of the form.
- Move Image Storage Locations via FileSystem. 

## Generative AI Use

**ChatGPT** was utilised throughout the project for code suggestions and improvements in particular to:

- Convert a ```<Picker>``` component into a ```<DropDownPicker>``` component in ```/components/custom/FormForm```

- Suggest the use of useFocusEffect over useEffect in ```/tabs/Forms/[id]/view/AddRecord``` and elsewhere, allowing updates whenever the user enters the page. 

- Code the check for special characters before adding field names to the API, in ```/components/custom/FormForm``` 
```bash return typeof value === 'string' && /[^a-zA-Z0-9_ ]/.test(value);``` 


**ChatGPT and GitHub Copilot** were also used to:

- Add Comprehensive comments and documentation throughout the code.