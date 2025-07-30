'use client';
import LoginBanner from './Components/LoginBanner';
import Nav from './Components/Nav';
import RecipeContainer from './Components/RecipeContainer';
import {createClient} from '@supabase/supabase-js';
import {useState, useEffect} from 'react';


export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  useEffect( ()=> {
    const getUser = async ()=> {
        const {data: {user}} = await supabase.auth.getUser();
        if (user){
            setIsLoggedIn(true);
        }
    }
    getUser();
  }, 
  [])

  if (!isLoggedIn){
      return (
          <div className='h-screen w-screen'>
            <Nav/>
            <LoginBanner/>
          </div>
      )
  }
  return (
    <div className='h-screen w-screen'>
      <Nav/>
      <RecipeContainer/>
    </div>
    
  );
}
