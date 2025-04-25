import React from "react";

function Error404() {
  return (
    <div className="w-full h-dvh flex flex-col justify-center items-center gap-10 px-5">
      <h1 className="text-4xl text-white-700 ">Upss... 🤷‍♂️</h1>

      <div className="text-9xl text-white-800 font-bold mb-28 ">
        Error 404
      </div>

      <div className="text-xl text-white-700 ">
        No se encontro la informacion solicitada
      </div>

    </div>
  );
}

export default Error404;
