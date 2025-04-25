import React from 'react';

function CrearCuenta() {
  return (
    <div className='flex flex-col px-10 pt-10 pb-6 w-full text-xl bg-white rounded-3xl shadow-sm max-md:px-5 max-md:max-w-full'>
      <div className='text-2xl max-md:max-w-full'>Informacion Personal</div>
      <div className='flex gap-5 mt-12 w-full max-md:flex-wrap max-md:mt-10 max-md:max-w-full'>
        <div className='flex flex-1 flex-auto gap-5 p-3 bg-white rounded-xl border border-solid border-zinc-400 max-md:flex-wrap'>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/901b45c4201e871a093be36011e11d67c87a2a83f1b3ebbe2277c9c344e2586d?'
            className='shrink-0 w-10 aspect-square'
          />
          <div className='flex-auto my-auto'>No. de Identidad</div>
        </div>
        <div className='flex flex-1 flex-auto gap-5 justify-between py-1.5 pr-px pl-3 whitespace-nowrap bg-white rounded-xl border border-solid border-zinc-400 max-md:flex-wrap max-md:max-w-full'>
          <div className='flex gap-5 my-auto'>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/6f0d77f80e6ee8666d6adda7c8c2fa6ff042503ddcbee77a0306c8f54d1a013e?'
              className='shrink-0 w-10 aspect-square'
            />
            <div className='flex-auto my-auto'>Ocupacion</div>
          </div>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/ec4a3bc0a6298c631cf35f1bf593a0dff48775591c252dccb73a6de5405d8359?'
            className='shrink-0 aspect-square w-[50px]'
          />
        </div>
      </div>
      <div className='flex gap-5 justify-between py-1.5 pr-px pl-3 mt-8 w-full whitespace-nowrap bg-white rounded-xl border border-solid border-zinc-400 max-md:flex-wrap max-md:max-w-full'>
        <div className='flex gap-5 my-auto'>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/5bcc3707599c71543f6ed15db44a038bc122fdfbc9da71dcafd063f6b0173d99?'
            className='shrink-0 w-10 aspect-square'
          />
          <div className='flex-auto my-auto'>Procedencia</div>
        </div>
        <img
          loading='lazy'
          src='https://cdn.builder.io/api/v1/image/assets/TEMP/ec4a3bc0a6298c631cf35f1bf593a0dff48775591c252dccb73a6de5405d8359?'
          className='shrink-0 aspect-square w-[50px]'
        />
      </div>
      <div className='flex gap-5 mt-8 w-full max-md:flex-wrap max-md:max-w-full'>
        <div className='flex flex-1 flex-auto gap-5 p-3 bg-white rounded-xl border border-solid border-zinc-400 max-md:flex-wrap'>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/1a6610e7f8427aaf19abafde942b3c27c81133cbaf957ae5d770719b3df6681e?'
            className='shrink-0 w-10 aspect-square'
          />
          <div className='flex-auto my-auto'>Primer Nombre</div>
        </div>
        <div className='flex flex-1 flex-auto gap-5 p-3 bg-white rounded-xl border border-solid border-zinc-400 max-md:flex-wrap'>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/70cefd2e917dd32298016438a676c8f102fd12f375ee5e32b0bfec3c68e03458?'
            className='shrink-0 w-10 aspect-square'
          />
          <div className='flex-auto my-auto'>Segundo Nombre</div>
        </div>
      </div>
      <div className='flex gap-5 mt-8 w-full max-md:flex-wrap max-md:max-w-full'>
        <div className='flex flex-1 flex-auto gap-5 p-3 bg-white rounded-xl border border-solid border-zinc-400 max-md:flex-wrap'>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/1a6610e7f8427aaf19abafde942b3c27c81133cbaf957ae5d770719b3df6681e?'
            className='shrink-0 w-10 aspect-square'
          />
          <div className='flex-auto my-auto'>Primer Apellido</div>
        </div>
        <div className='flex flex-1 flex-auto gap-5 justify-between py-1.5 pr-px pl-3 whitespace-nowrap bg-white rounded-xl border border-solid border-zinc-400 max-md:flex-wrap max-md:max-w-full'>
          <div className='flex gap-5 justify-between my-auto'>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/13c8bc4910d2108b9b876d90c6e6f90ef0e4488eabb00f96b57db7a737910786?'
              className='shrink-0 w-10 aspect-square'
            />
            <div className='my-auto'>Genero</div>
          </div>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/ec4a3bc0a6298c631cf35f1bf593a0dff48775591c252dccb73a6de5405d8359?'
            className='shrink-0 aspect-square w-[50px]'
          />
        </div>
      </div>
      <div className='flex gap-5 items-start px-3 pt-2.5 pb-10 mt-8 whitespace-nowrap bg-white rounded-xl border border-solid border-zinc-400 max-md:flex-wrap'>
        <img
          loading='lazy'
          src='https://cdn.builder.io/api/v1/image/assets/TEMP/b92ea4c4c01b7c7738f0663290d52969969ccb5e662ca5f7e9f08ade75e58f8f?'
          className='shrink-0 w-10 aspect-square'
        />
        <div className='flex-auto mt-3 max-md:max-w-full'>Direccion</div>
      </div>
      <div className='flex gap-5 mt-8 w-full max-md:flex-wrap max-md:max-w-full'>
        <div className='flex flex-1 flex-auto gap-5 p-3 bg-white rounded-xl border border-solid border-zinc-400 max-md:flex-wrap'>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/c495e4ec884d3450a4682f51928f43cfd6f8f0703d21abd2d5b62dd62bd72ba5?'
            className='shrink-0 w-10 aspect-square'
          />
          <div className='flex-auto my-auto'>Fecha de Nacimiento</div>
        </div>
        <div className='flex flex-1 flex-auto gap-5 p-3 whitespace-nowrap bg-white rounded-xl border border-solid border-zinc-400 max-md:flex-wrap'>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/c5df81cf03601b91a27b5a9ba61ccbb2d895d61c36b24275e35e8dae40b41836?'
            className='shrink-0 w-10 aspect-square'
          />
          <div className='flex-auto my-auto'>Telefono</div>
        </div>
      </div>
      <div className='flex flex-col px-14 pt-6 pb-16 mt-5 w-full bg-white rounded-3xl shadow-sm max-md:px-5 max-md:max-w-full'>
        <div className='text-2xl max-md:max-w-full'>Rol y Usuario</div>
        <div className='flex gap-5 mt-8 w-full text-xl max-md:flex-wrap max-md:max-w-full'>
          <div className='flex flex-1 flex-auto gap-5 p-3 bg-white rounded-xl border border-solid border-zinc-400 max-md:flex-wrap'>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/1a6610e7f8427aaf19abafde942b3c27c81133cbaf957ae5d770719b3df6681e?'
              className='shrink-0 w-10 aspect-square'
            />
            <div className='flex-auto my-auto'>Nombre Usuario</div>
          </div>
          <div className='flex flex-1 flex-auto gap-5 justify-between py-1.5 pr-px pl-3 whitespace-nowrap bg-white rounded-xl border border-solid border-zinc-400 max-md:flex-wrap max-md:max-w-full'>
            <div className='flex gap-5 justify-between my-auto'>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/fe93846fd10dd72c2f492be644a6e6a2a107adff1e3421cea6c4504c343446a8?'
                className='shrink-0 w-10 aspect-square'
              />
              <div className='my-auto'>Rol</div>
            </div>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/451f9bb64d4d66a46f6464895978483cde79ddaa65420d76122c1b8fcaf61006?'
              className='shrink-0 aspect-square w-[50px]'
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col px-14 py-7 mt-5 w-full text-xl bg-white rounded-3xl shadow-sm max-md:px-5 max-md:max-w-full'>
        <div className='text-2xl max-md:max-w-full'>Contraseña</div>
        <div className='flex gap-5 mt-9 w-full max-md:flex-wrap max-md:max-w-full'>
          <div className='flex flex-1 flex-auto gap-5 justify-between px-2.5 py-3 whitespace-nowrap bg-white rounded-xl border border-solid border-zinc-400 max-md:flex-wrap max-md:max-w-full'>
            <div className='flex gap-5'>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/dcc124d479c77ce2ee8ab5494ee103c230a62de45c0842f62b6c2e953be2d81a?'
                className='shrink-0 w-10 aspect-square'
              />
              <div className='flex-auto my-auto'>Contraseña</div>
            </div>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/6be985356e0b8da591556b07ba6a9e25969288e63baa0ed99c354e3d779bf677?'
              className='shrink-0 w-10 aspect-square'
            />
          </div>
          <div className='flex flex-1 flex-auto gap-5 p-3 bg-white rounded-xl border border-solid border-zinc-400 max-md:flex-wrap'>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/dcc124d479c77ce2ee8ab5494ee103c230a62de45c0842f62b6c2e953be2d81a?'
              className='shrink-0 w-10 aspect-square'
            />
            <div className='flex-auto my-auto'>Confirmar Contraseña</div>
          </div>
        </div>
        <div className='justify-center items-center self-center px-16 py-8 mt-16 max-w-full text-center text-white bg-emerald-300 rounded-3xl w-[300px] max-md:px-5 max-md:mt-10'>
          Crear Cuenta
        </div>
      </div>
    </div>
  );
}

export default CrearCuenta;
