# Shopping List App - Frontend

Welcome to the frontend of the shopping list application! This project is built using React and Vite, leveraging TypeScript for type safety and enhanced development experience.

![Screenshot 2024-08-04 142539](https://github.com/user-attachments/assets/53cea276-316c-4f9e-9b8c-bed815a0df13)


![Screenshot 2024-08-04 140740](https://github.com/user-attachments/assets/d51847ba-626f-48a9-9b83-92c2e2443bfe)


## Folder Structure

The project is organized into the following directories and files:

- **`components/`**: Contains reusable React components written in TypeScript (.tsx files) that form the core of the application's interface.
- **`context/`**: Includes React context providers in TypeScript for managing global state across the application.
- **`hooks/`**: Houses custom React hooks in TypeScript (.ts files) that encapsulate reusable logic and side effects.
- **`layout/`**: Provides layout components for structuring various pages and sections of the application, written in TypeScript (.tsx files).
- **`services/`**: Manages API interactions and external services utilized by the frontend, implemented in TypeScript (.ts files).
- **`app.ts`**: The root component written in TypeScript that sets up routing and context providers.
- **`index.ts`**: The entry point of the application, written in TypeScript, that renders the root component into the DOM.

## Configuration

The frontend application can be configured to run with either HTTP or HTTPS based on settings in the `.env` file:

- **HTTP**: If configured for HTTP, the application will run on port `80`.
- **HTTPS**: If configured for HTTPS, the application will run on port `443`.

This flexibility allows the application to adapt to different deployment environments and security requirements.

## Features

The frontend application includes a range of features designed to enhance user experience:

- **Real-Time Updates**: Utilizes EventSource to provide real-time updates, allowing users to see the latest changes without needing to refresh the page.
- **Google Sign-In**: Integrates Google Sign-In for seamless authentication using Google accounts.
- **Product Management**:
  - **Add Products**: Users can add new products to their shopping list.
  - **View Products**: Users can view all products within a specific group.
  - **Comment on Products**: Users can add comments to products for feedback or notes.
  - **Delete Products**: Users can delete products from their list once purchased.
  - **Edit Products**: Users can edit the details of their products.
- **Profile Management**: Users can manage their profiles, including updating personal information and changing their profile photo.
- **Recipe API Integration**: Connects to an external recipe API to fetch and display recipes for various dishes, enhancing the shopping experience.

## Production Setup

For production, the frontend application is managed using PM2. This tool ensures that the application is monitored and maintained for optimal performance and reliability.

## Getting Started

To get started with the frontend application:

1. Clone the repository.
2. Install dependencies with `npm install` or `yarn install`.
3. Configure the `.env` file to set up HTTP or HTTPS as needed.
4. Run the development server with `npm run dev` or `yarn dev`.
5. For production, build the application with `npm run build` or `yarn build`, and start it with PM2.

### Complete Application
The Shopping List App combines both the backend and frontend components to provide a full-featured shopping management system. By integrating these parts, users benefit from a cohesive and efficient application for managing their shopping needs.
```sh
git@github.com:chenB-Y/backend_WebAdvance.git
```

## Contributing

Contributions are welcome! If you have suggestions or improvements, please open an issue or submit a pull request.
