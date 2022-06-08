import React, { useEffect, useState } from "react";
import Hendi from "./Hendi";
import "../Style/VirtualHendiInterface.css";
import TemperatureController from "./TemperatureController";
import WavelengthController from "./WavelengthController";
import Spinner from "./Spinner";
import Spectrum from "./Spectrum";
import axios from "axios";
import Instructions from "./Instructions";
import { Error } from "./Error";

// Imports to get these files on the github page
// import cli from "./interpolator/cli.py";
// import handle from "./interpolator/handler.py";

function VirtualHendiInterface() {
  const hendiRef = React.createRef();
  const tempRef = React.createRef();
  const [temperature, setTemperature] = useState(13.5);
  const lambdaRef = React.createRef();
  const [min_lambda, setMinLambda] = useState(2030);
  const [max_lambda, setMaxLambda] = useState(2090);
  let _isMounted = false;

  const [fgState, setFgState] = useState(true);
  const [toggleFgTitle, setToggleFgTitle] = useState(
    "See Inside the Instrument"
  );
  const [spectrum, setSpectrum] = useState("");
  const [loadingSpectrum, setLoadingSpectrum] = useState(false);
  const [spectrumError, setSpectrumError] = useState(false);

  const baseUrl = window.location.href.includes("localhost:3000")
    ? "http://localhost:3000"
    : "https://brennaser.github.io/Virtual-HeNDI-Spectrometer";

  useEffect(() => {
    _isMounted = true;
  }, []);

  const hideForeground = () => {
      if (fgState) {
        setFgState(false);
        setToggleFgTitle("Toggle Instrument Transparency");
      } else {
        setFgState(true);
        setToggleFgTitle("See Inside the Instrument");
      }
  };

  const getSpectrum = () => {
    const params = {
      temperature,
      min_lambda,
      max_lambda,
    };
    console.log(params);
    const url = `${baseUrl}/interpolator/${params.temperature}/${params.min_lambda}/${params.max_lambda}`;
    // const url = `https://api.virtual-hendi.isaac-j-miller.com/interpolator/${params.temperature}/${params.min_lambda}/${params.max_lambda}`;
    console.log("requesting spectrum");
    setLoadingSpectrum(true);
    axios
      .get(url)
      .then((resp1) => {
        // const urlToUse = `https://virtual-hendi.isaac-j-miller.com${resp1.data.url}`;
        const urlToUse = resp1.data.url;
        axios
          .get(urlToUse)
          .then((resp) => {
            console.log("received spectrum");
            setSpectrum(resp.data);
            setLoadingSpectrum(false);
            setSpectrumError(false);
          })
          .catch((reason) => {
            console.error("error loading spectrum:", reason);
            setLoadingSpectrum(false);
            setSpectrumError(true);
          });
      })
      .catch((reason) => {
        console.error("error triggering lambda:", reason);
        setLoadingSpectrum(false);
        setSpectrumError(true);
      });
  };

  return (
    <div id="main-virtual-hendi-interface-container">
      <Hendi id="hendi-instrument" ref={hendiRef} seeOutside={fgState} />
      <div id="control-box">
        <button onClick={hideForeground}>{toggleFgTitle}</button>
        <TemperatureController
          id="temperature-controller"
          ref={tempRef}
          temperature={temperature}
          setTemperature={setTemperature}
        />
        <WavelengthController
          id="wavelength-controller"
          parent={this}
          ref={lambdaRef}
          min_lambda={min_lambda}
          setMinLambda={setMinLambda}
          max_lambda={max_lambda}
          setMaxLambda={setMaxLambda}
        />
        <button onClick={getSpectrum}>Run Spectrum</button>
        {loadingSpectrum ? (
          <Spinner />
        ) : spectrumError ? (
          <Error />
        ) : (
          spectrum && <Spectrum data={spectrum} />
        )}
        <Instructions></Instructions>
      </div>
    </div>
  );
}
export default VirtualHendiInterface;
