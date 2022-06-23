import React, { useState } from "react";
import "../style/Knob.css";

function Knob(props) {
  handleDrag = handleDrag.bind();

  // TODO - this is never used
  const [step, setStep] = useState(1);

  const handleDrag = (event) => {
    event.preventDefault();
    console.log(event);
    console.log(event.movementX, event.movementY);
  };

  return <div className="knob" onDrag={handleDrag}></div>;
}

// export default class Knob extends Component{
//     constructor(props){
//         super(props);
//         this.handleDrag=this.handleDrag.bind(this);
//         this.props = props;
//         this.state={
//             step:1,
//             ...props
//         }
//     }
//     handleDrag(event){
//         event.preventDefault();
//         console.log(event);
//         console.log(event.movementX, event.movementY);
//     }
//     render(){
//         return <div className='knob' onDrag={this.handleDrag}></div>
//     }
// }
