import React, { useState, useEffect } from 'react'
import { Context } from "./context/context";
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import Main from './pages/main/main'
import Cart from './pages/cart/cart'
import FullItem from "./pages/main/fullItem";
import Login from './Login/login'

 const App = () => {
    const [userid, setUserid] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hasAccount, setHasAccount] = useState(true);
    const [errormsg, setErrormsg] = useState('');

    const clearInputs = () => {
        setEmail('');
        setPassword('');
    };
    const clearErrors = () => {
        setErrormsg('');
    };
    const handleLogin = () => {
        clearErrors();
        async function collectdata(){
            let data = await fetch("http://localhost:5000/signin",{
                method:"post",
                body:JSON.stringify({email,password}),
                headers:{
                    'Content-Type':'application/json'
                }
            });
            if(data.status === 200)
            {
            data = await data.json();
            setUserid(data._id);
            setEmail(email);
            }
            else setErrormsg(data.statusText);
        };
        collectdata();
    };
    const handleSignin = () => {
        clearErrors();
       
        async function collectdata(){
            let data = await fetch("http://localhost:5000/signup",{
                method:"post",
                body:JSON.stringify({email,password}),
                headers:{
                    'Content-Type':'application/json'
                }
            });
            if(data.status === 200)
           { 
            data = await data.json();
            setUserid(data._id); 
            }
            else setErrormsg(data.statusText);
        };
        collectdata();
    };
    const handleLogout = () => {
        setUserid('');
        clearErrors();
        clearInputs();
    };
    const authListener = () => {
    };
    useEffect(() => {
        authListener();
    });
    return (
        <>
            {userid ? (
                <BrowserRouter>
                <Context userid={userid}>
                    {}
                        <Switch>
                        <Route exact path="/" render={() => <Main handleLogout={handleLogout} email={email} userid={userid}/>}/>
                        <Route path="/cart" component={()=> <Cart email={email}/>} exact/>
                        <Route path="/item/:id" children={<FullItem  />} />
                        </Switch>
                </Context>
                </BrowserRouter>
            ) : (
                <Login
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    handleLogin={handleLogin}
                    handleSignin={handleSignin}
                    hasAccount={hasAccount}
                    setHasAccount={setHasAccount}
                    errormsg={errormsg}
                />
            )}
        </>
    )
}

export default App