import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./game/punto";
import Home from "./Home";
import Victory from "./game/victory";
import GenerateGames from "./generateGames";

export default function App () {
    return (
        <div className="app">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} /> 
                    <Route path="/game" element={<Game />} />
                    <Route path="/victory" element={<Victory />} />
                    <Route path="/generate-games" element={<GenerateGames />} />
                </Routes>
            </Router>
        </div>
    )
}