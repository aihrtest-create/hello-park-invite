import Link from "next/link";
import '../styles/theme.css'; // Adjust path if needed

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-[#FF4D00]">Hello Park Invite</h1>
        <p className="text-gray-600 mb-8">
          Проект запущен! Выберите, куда перейти:
        </p>
        
        <div className="flex flex-col gap-4">
          <Link 
            href="/invite" 
            className="bg-[#FF4D00] text-white px-6 py-3 rounded-full font-bold hover:bg-[#E64500] transition-colors"
          >
            Форма создания (invite)
          </Link>
          
          <Link 
            href="/invite-variants" 
            className="bg-gray-100 text-gray-800 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            Карточки (invite-variants)
          </Link>
          
          <Link 
            href="/invite-dashboard" 
            className="bg-gray-800 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-900 transition-colors"
          >
            Дашборд (invite-dashboard)
          </Link>
        </div>
      </div>
    </div>
  );
}
