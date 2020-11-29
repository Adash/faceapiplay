import { useState, useEffect } from 'react';
import { VideoZone } from './VideoZone';

export const Main = () => {
  const [item1, setItem1] = useState('');
  const [item2, setItem2] = useState('');

  const click1 = () => {
    setItem1('whoa!');
  };

  const click2 = () => {
    setItem2('whoooh!');
  };

  useEffect(() => {
    setItem1('---');
    setItem2('---');
  }, []);

  return (
    <main className="main">
      {/* <div className="area">
        <p>I'm in the area</p>
        <p>{item1}</p>
        <p>{item2}</p>
      </div> */}
      <VideoZone />
      {/* <div className="bootonz-wrapper">
        <button className="booton" onClick={click1}>
          Click me to do a thing
        </button>
        <button className="booton" onClick={click2}>
          Click me to do another thing
        </button>
      </div> */}
    </main>
  );
};
