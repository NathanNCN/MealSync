'use client';
import Nav from './Components/Nav';
import {useState} from 'react';
import RecipeContainer from './Components/RecipeContainer';


export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className='h-screen w-screen'>
      <Nav/>
      <RecipeContainer/>
    </div>
    
  );
}
