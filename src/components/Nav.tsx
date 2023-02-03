import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Nav.css";
import "../css/index.css";
import DarkMode from "./DarkMode";
import logo from "../assets/images/logo.png";
import { nanoid } from "nanoid";


export default function Nav(props: any) {
  const navLinks = [
    // {
    //   name: "Poker",
    //   path: "/poker",
    // },
    // {
    //   name: "Blackjack",
    //   path: "/blackjack",
    // },
    // {
    //   name: "War",
    //   path: "/war",
    // },
    // {
    //   name: "Dice",
    //   path: "/dice",
    // },
    {
      name: "Deck",
      path: "/deck",
    },
  ];


  return (
    <div className="Nav">
      <div className="nav-title">
        <Link className="nav-link" to="/">
          <img className="nav-logo" src={logo} />
        </Link>
      </div>

      <ul className="nav-list">
        {navLinks.map((link: any) => (
          <li className="nav-item" key={nanoid()}>
            <Link className="nav-link" to={link.path}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* <DarkMode /> */}
      <div className=""></div>
    </div>
  );
}
