// // src/pages/HomePage.tsx
// import { useNavigate } from 'react-router-dom';
// import {
//   CloudArrowUpIcon,
//   ShieldCheckIcon,
//   DocumentIcon,
//   LinkIcon,
//   ChartBarIcon,
//   GlobeAltIcon,
//   ArrowRightIcon,
// } from '@heroicons/react/24/outline';
// import { Button } from '../components/common/Button';
// import { useAuth } from '../hooks/useAuth';

// const FEATURES = [
//   {
//     icon: CloudArrowUpIcon,
//     title: 'Easy Upload',
//     description: 'Drag and drop files or browse from your device. Support for all file types.',
//     color: 'text-blue-400',
//     bgColor: 'bg-blue-500/10',
//   },
//   {
//     icon: ShieldCheckIcon,
//     title: 'Secure Storage',
//     description: 'End-to-end encryption keeps your files safe. Only you control access.',
//     color: 'text-green-400',
//     bgColor: 'bg-green-500/10',
//   },
//   {
//     icon: LinkIcon,
//     title: 'Share Instantly',
//     description: 'Generate shareable links in one click. No registration required for recipients.',
//     color: 'text-purple-400',
//     bgColor: 'bg-purple-500/10',
//   },
//   {
//     icon: ChartBarIcon,
//     title: 'Download Analytics',
//     description: 'Track who downloads your files with detailed analytics dashboard.',
//     color: 'text-yellow-400',
//     bgColor: 'bg-yellow-500/10',
//   },
//   {
//     icon: DocumentIcon,
//     title: 'File Management',
//     description: 'Organize, search, and manage all your files from a single dashboard.',
//     color: 'text-pink-400',
//     bgColor: 'bg-pink-500/10',
//   },
//   {
//     icon: GlobeAltIcon,
//     title: 'Access Anywhere',
//     description: 'Access your files from any device, anywhere in the world.',
//     color: 'text-cyan-400',
//     bgColor: 'bg-cyan-500/10',
//   },
// ];

// const HomePage = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();

//   return (
//     <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900">
//       {/* Navbar */}
//       <nav className="border-b border-white/10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-linear-to-b from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
//                 <CloudArrowUpIcon className="w-5 h-5 text-white" />
//               </div>
//               <span className="text-xl font-bold text-white">FileShare</span>
//             </div>

//             <div className="flex items-center gap-3">
//               {isAuthenticated ? (
//                 <Button variant="primary" onClick={() => navigate('/dashboard')}>
//                   Go to Dashboard
//                   <ArrowRightIcon className="w-4 h-4 ml-2" />
//                 </Button>
//               ) : (
//                 <>
//                   <Button variant="ghost" onClick={() => navigate('/login')}>
//                     Sign In
//                   </Button>
//                   <Button variant="primary" onClick={() => navigate('/register')}>
//                     Get Started
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0">
//           <div className="absolute -top-1/2 -right-1/4 w-200 h-20 bg-primary-600/20 rounded-full blur-[128px]" />
//           <div className="absolute -bottom-1/2 -left-1/4 w-200 h-20 bg-accent-600/20 rounded-full blur-[128px]" />
//         </div>

//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
//           <div className="text-center max-w-4xl mx-auto">
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
//               Secure File Sharing
//               <span className="block text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-accent-400">
//                 Made Simple
//               </span>
//             </h1>

//             <p className="text-lg sm:text-xl text-slate-400 mt-6 max-w-2xl mx-auto">
//               Upload, store, and share your files with enterprise-grade security.
//               Get detailed analytics and control who accesses your content.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
//               {isAuthenticated ? (
//                 <Button
//                   variant="primary"
//                   size="lg"
//                   onClick={() => navigate('/dashboard')}
//                 >
//                   Go to Dashboard
//                   <ArrowRightIcon className="w-5 h-5 ml-2" />
//                 </Button>
//               ) : (
//                 <>
//                   <Button
//                     variant="primary"
//                     size="lg"
//                     onClick={() => navigate('/register')}
//                   >
//                     Start Free Trial
//                     <ArrowRightIcon className="w-5 h-5 ml-2" />
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="lg"
//                     onClick={() => navigate('/login')}
//                     className="border-white/20 text-white hover:bg-white/10"
//                   >
//                     Sign In
//                   </Button>
//                 </>
//               )}
//             </div>

//             <p className="text-sm text-slate-500 mt-4">
//               No credit card required. Free forever plan.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 sm:py-24">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl sm:text-4xl font-bold text-white">
//               Everything You Need
//             </h2>
//             <p className="text-lg text-slate-400 mt-4">
//               Powerful features to manage and share your files
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {FEATURES.map((feature, index) => (
//               <div
//                 key={index}
//                 className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
//               >
//                 <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>
//                   <feature.icon className={`w-6 h-6 ${feature.color}`} />
//                 </div>
//                 <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
//                 <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 sm:py-24">
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="backdrop-blur-xl bg-linear-to-r from-primary-600/20 to-accent-600/20 rounded-3xl p-8 sm:p-12 border border-white/10 text-center">
//             <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
//               Ready to get started?
//             </h2>
//             <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
//               Join thousands of users who trust FileShare for secure file storage and sharing.
//             </p>

//             {isAuthenticated ? (
//               <Button
//                 variant="primary"
//                 size="lg"
//                 onClick={() => navigate('/dashboard')}
//               >
//                 Go to Dashboard
//                 <ArrowRightIcon className="w-5 h-5 ml-2" />
//               </Button>
//             ) : (
//               <Button
//                 variant="primary"
//                 size="lg"
//                 onClick={() => navigate('/register')}
//               >
//                 Create Free Account
//                 <ArrowRightIcon className="w-5 h-5 ml-2" />
//               </Button>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-white/10 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-6 bg-linear-to-br from-primary-600 to-accent-600 rounded flex items-center justify-center">
//                 <CloudArrowUpIcon className="w-4 h-4 text-white" />
//               </div>
//               <span className="text-white font-medium">FileShare</span>
//             </div>

//             <p className="text-sm text-slate-500">
//               &copy; {new Date().getFullYear()} FileShare. All rights reserved.
//             </p>

//             <div className="flex gap-6">
//               <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy</a>
//               <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Terms</a>
//               <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;

