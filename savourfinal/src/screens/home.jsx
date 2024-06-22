import React from 'react';
import './home.css';
import Storybar from './story.jsx';
import Feedpost from './feedpost.jsx'
import Suggest from './suggestionbar.jsx';

function Feed() {
  return (
    <div className='row m-0 p-0'>
      <div className='bgcolor col-9 m-0 p-0' >
        <div className='bgcolor m-0 p-3' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Feedpost/>
        </div>
      </div>
      <div className='col-3 m-0 p-0 shadow-lg'>
        <Suggest/>
      </div>
    </div>
  );
}

export default Feed;



