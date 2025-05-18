
# Image-to-Image Platform

This project is an AI-powered image-to-image generation platform that uses OpenAI's GPT-Image-1 model to generate new images based on user-uploaded images and specified prompts.

## Features
- Upload an image (supports JPEG and PNG).
- Enter a prompt to guide image generation.
- Choose the aspect ratio for the output image (1:1, 2:3, 3:2, auto).
- View and download the generated image.
- Smooth and modern UI with a responsive design.

## Tech Stack
- **Frontend:** Next.js, Tailwind CSS, React
- **Backend:** Next.js API Routes
- **Image Processing:** Sharp
- **AI API:** OpenAI's DALL-E API
- **Hosting:** Vercel

## Live Demo
https://ima-gine-dcmn.vercel.app/

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yranFrank/ImaGine.git
   cd ImaGine
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at [http://localhost:3000](http://localhost:3000)

## Build for Production
To create a production build:
```bash
npm run build
npm start
```

## Deployment on Vercel
1. Create a new project on [Vercel](https://vercel.com/).
2. Connect your GitHub repository.
3. Set the following environment variable in Vercel:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Deploy the project.

## Troubleshooting
- If you encounter errors related to sharp during deployment, make sure you have the correct version and install method in your package.json:
  ```
  npm install sharp@0.30.6 --platform=linux --arch=x64 --include=optional
  ```
- If you encounter issues with image generation, check your OpenAI API key and ensure it has the necessary permissions.

## License
This project is licensed under the MIT License.

## Contribution
Feel free to submit issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

## Contact
- Developer: Frank Ran
- GitHub: [yranFrank](https://github.com/yranFrank)
