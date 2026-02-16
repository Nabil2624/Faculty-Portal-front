import ResponsiveLayoutProvider from "../components/ResponsiveLayoutProvider";

export default function GridLayoutFullScreen() {
  return (
    <ResponsiveLayoutProvider>
      <div className="rtl w-screen-[90vh] h-[90vh] p-2">
        <div className="grid grid-rows-4 grid-cols-6 gap-2 w-full h-full">
          {/* Row 1 */}
          <div className="bg-gray-300 border-4 border-blue-900 flex items-center justify-center row-span-2 col-span-1 min-h-[80px]">
            {/* Container 1 */}
          </div>
          <div className="bg-gray-300 border-4 border-blue-900 flex items-center justify-center col-start-2 col-span-5 min-h-[80px]">
            {/* Container 2 */}
          </div>

          {/* Row 2 */}
          <div className="bg-gray-300 border-4 border-blue-900 flex items-center justify-center row-start-2 col-start-2 min-h-[60px]">
            {/* Container 3 */}
          </div>
          <div className="bg-gray-300 border-4 border-blue-900 flex items-center justify-center row-start-2 col-start-3 min-h-[60px]">
            {/* Container 4 */}
          </div>
          <div className="bg-gray-300 border-4 border-blue-900 flex items-center justify-center row-start-2 col-start-4 min-h-[60px]">
            {/* Container 5 */}
          </div>
          <div className="bg-gray-300 border-4 border-blue-900 flex items-center justify-center row-start-2 col-start-5 min-h-[60px]">
            {/* Container 6 */}
          </div>
          <div className="bg-gray-300 border-4 border-blue-900 flex items-center justify-center row-start-2 col-start-6 min-h-[60px]">
            {/* Container 7 */}
          </div>

          {/* Row 3 & 4 */}
          <div className="bg-gray-300 border-4 border-blue-900 flex items-center justify-center row-start-3 row-span-2 col-start-1 min-h-[100px]">
            {/* Container 8 */}
          </div>
          <div className="bg-gray-300 border-4 border-blue-900 flex items-center justify-center row-start-3 row-span-2 col-start-2 col-span-2 min-h-[100px]">
            {/* Container 9 */}
          </div>
          <div className="bg-gray-300 border-4 border-blue-900 flex items-center justify-center row-start-3 row-span-2 col-start-4 col-span-2 min-h-[100px]">
            {/* Container 10 */}
          </div>
          <div className="bg-gray-300 border-4 border-blue-900 flex items-center justify-center row-start-3 row-span-2 col-start-6 min-h-[100px]">
            {/* Container 11 */}
          </div>
        </div>
      </div>
    </ResponsiveLayoutProvider>
  );
}
