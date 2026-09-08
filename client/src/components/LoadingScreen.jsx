export function LoadingScreen({ loadingMessage }) {
    return (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-violet-200 border-t-amber-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                </div>
                <div className="text-2xl font-light text-violet-900 tracking-wide">{loadingMessage}</div>
            </div>
        </div>
    );
}

// export function InlineLoader() {
//   return (
//     <div className="w-5 h-5 border-2 border-violet-200 border-t-amber-600 rounded-full animate-spin"></div>
//   );
// }

// export function SkeletonCardLoader() {
//   return (
//     <div className="bg-white rounded-lg p-6 shadow-sm">
//       <div className="flex gap-4">
//         <div className="w-24 h-24 bg-amber-50 rounded-lg animate-pulse"></div>
//         <div className="flex-1 space-y-3">
//           <div className="h-4 bg-amber-50 rounded animate-pulse w-3/4"></div>
//           <div className="h-4 bg-amber-50 rounded animate-pulse w-1/2"></div>
//           <div className="h-4 bg-amber-50 rounded animate-pulse w-5/6"></div>
//         </div>
//       </div>
//       <div className="mt-6 space-y-3">
//         <div className="h-3 bg-violet-50 rounded animate-pulse"></div>
//         <div className="h-3 bg-violet-50 rounded animate-pulse w-11/12"></div>
//         <div className="h-3 bg-violet-50 rounded animate-pulse w-4/5"></div>
//       </div>
//     </div>
//   );
// }
