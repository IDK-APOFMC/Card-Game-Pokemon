import "./styles/style.css";

import createApp from "./components/app.js";

const app = document.querySelector("#app");

app.appendChild(createApp());
