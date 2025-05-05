const Mapbutton = () => {
    return (  
        <div className="flex flex-col gap-4">
          <div className="fixed top-4 left-4"></div>
              <div className="fixed bottom-4 right-4 z-50">
            <button className="w-14 h-14 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors flex items-center justify-center text-lg">
              +
            </button>
            <button className="w-14 h-14 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors flex items-center justify-center mt-4 text-lg">
              -
            </button>
              </div>
        </div>
    );
}
 
export default Mapbutton;