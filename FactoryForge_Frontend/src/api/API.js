import axios from "axios";

const API = axios.create({
  baseURL: "https://factoryforge-5f88b931d18d.herokuapp.com/api/",
});

export default API;
