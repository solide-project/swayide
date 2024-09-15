<p align="center">
  <h2 align="center">SwayIDE</h2>
  <p align="center"><b>Powerful Smart Contract IDE for Sway</b></p>
  <p align="center">A feature-rich and intuitive integrated development environment designed for developing, compiling, and deploying Sway smart contracts with ease.</p>
</p>

## About SwayIDE

**SwayIDE** is an open-source Integrated Development Environment (IDE) crafted specifically for **Sway** smart contracts. It provides developers with a comprehensive and user-friendly platform for writing, compiling, and deploying contracts within the Fuel blockchain ecosystem. SwayIDE facilitates seamless interaction with Fuel networks, offering efficient contract management and testing. This repository serves as the home for SwayIDE, supporting developers in their journey of smart contract development and deployment on Fuel.

## Documentation

To start using SwayIDE, visit our [Documentation](https://docs.solide0x.tech/docs/ide/sway-ide)

## Getting Started

To run SwayIDE locally, follow these steps:

### Clone the Repository
First, clone the SwayIDE repository to your local machine using Git:
```bash
git clone https://github.com/solide-project/swayide
```

### Install Dependencies
Navigate into the cloned repository directory and install the required npm packages:
```bash
cd swayide
bun install
```

### Install Backend Compiler
Next, install fuel cli and toolkit and any backend dependency for interacting with swa
```bash
curl https://install.fuel.network | sh
```

### Configure Environment Variables
Create a `.env.local` file in the root directory of the project and use the following template to fill in the required variables:
```
PROJECT_PATH=
GITHUB_API_KEY=
```

### Running SwayIDE
After configuring the environment variables, start the SwayIDE IDE:
```bash
bun run start
```

This command will launch the SwayIDE IDE in your default web browser.

## Contribution Guidelines

We welcome contributions from the community to enhance SwayIDE further. If you have suggestions, bug reports, or want to contribute code, please follow our [Contribution Guidelines](link-to-contribution-guidelines).

## Community and Support

Join the SwayIDE community for discussions, support, and collaboration. Visit our [Discord channel (Coming Soon)](#) to connect with fellow developers and enthusiasts.

## License

SwayIDE is released under the [MIT License](link-to-license). Feel free to use, modify, and distribute SwayIDE for your projects.