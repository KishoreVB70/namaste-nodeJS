import React, { useState } from 'react'
import { Actor, ActorSubclass, HttpAgent, Identity } from "@dfinity/agent";

function Login() {
  const [agent, setAgent] = useState("");

  function login() {
    const agent = await HttpAgent.create({ host: host, identity })

  }
  return (
    <div>
      <button onClick={login}>Login</button>
    </div>
  )
}

export default Login