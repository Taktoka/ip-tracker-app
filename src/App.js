import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import Arrow from "./images/icon-arrow.svg";
import background from "./images/pattern-bg-desktop.png";
import { useEffect, useState } from "react";
import axios from "axios";
import MarkerPosition from "./MarkerPosition";

function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

  useEffect(() => {
    axios
      .get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&
        ipAddress=8.8.8.8`
      )
      .then((res) => {
        console.log(res.data);
        setAddress(res.data);
      });
  }, []);

  function getIpAddress() {
    axios
      .get(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${
          process.env.REACT_APP_API_KEY
        }&${
          checkIpAddress.test(ipAddress)
            ? `ipAddress=${ipAddress}`
            : checkDomain.test(ipAddress)
            ? `domain=${ipAddress}`
            : ""
        }`
      )
      .then((res) => {
        setAddress(res.data);
      });
  }

  function hndlesubmit(e) {
    e.preventDefault();
    getIpAddress();
    setIpAddress("");
  }

  return (
    <>
      <section>
        <div className="absolute -z-10">
          <img src={background} className="w-full h-80 object-cover" alt="" />
        </div>
        <article className="p-8 text-center">
          <h1 className="text-2xl text-white font-bold mb-8 lg:text-3xl">
            Ip Address Tracker
          </h1>
          <form
            onSubmit={hndlesubmit}
            autoComplete="off"
            className="flex justify-center mx-auto max-w-xl"
          >
            <input
              type="text"
              name="ipadress"
              placeholder="Search for any IP adress"
              required
              className="py-2 px-4 rounded-l-lg w-full"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
            <button
              type="submit"
              className="bg-black py-4 pt-3 px-4 hover:opacity-60 rounded-r-lg"
            >
              <img src={Arrow} alt="" />
            </button>
          </form>
        </article>
        {address && (
          <article
            className="bg-white rounded-lg  shadow p-8 mx-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl xl:mx-auto text-center md:text-left lg:-mb-16 relative"
            style={{ zIndex: 10000 }}
          >
            <div className="lg:border-r lg:border-slate-400">
              <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                Ip Address
              </h2>
              <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                {address.ip}
              </p>
            </div>
            <div className="lg:border-r lg:border-slate-400">
              <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                Location
              </h2>
              <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                {address && address.location.city} ,
                {address && address.location.region}
              </p>
            </div>
            <div className="lg:border-r lg:border-slate-400">
              <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                Timezone
              </h2>
              <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                UTC {address.location.timezone}
              </p>
            </div>
            <div>
              <h2 className="uppercase text-sm font-bold text-slate-500 tracking-wider mb-3">
                ISP
              </h2>
              <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-2xl">
                {address.isp}
              </p>
            </div>
          </article>
        )}
        {address && (
          <MapContainer
            center={[address.location.lat, address.location.lng]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "700px", width: "100vw" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerPosition address={address} />
          </MapContainer>
        )}
      </section>
    </>
  );
}

export default App;
