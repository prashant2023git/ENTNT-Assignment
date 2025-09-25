import React from 'react';

const DashboardPage = () => {
  const stats = [
    { title: 'Active Jobs', value: '12', link: 'jobs', icon: 'M15.75 12V3.75H17.25V12H15.75Z' },
    { title: 'Total Candidates', value: '345', link: 'candidates', icon: 'M12 11.25a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5ZM4.505 18.75h14.99a3.75 3.75 0 000-7.5H4.505a3.75 3.75 0 000 7.5Z' },
    { title: 'Pending Assessments', value: '23', link: 'assessments', icon: 'M18 6.75h-1.5V1.5h-1.5v5.25H12V1.5H10.5v5.25H9V1.5H7.5v5.25H6V1.5H4.5v5.25H3V22.5h18V6.75h-3Z' },
  ];

  const recentActivity = [
    { name: 'Ujjwal Verma', action: 'applied for', detail: 'Software Engineer', time: '2 hours ago', tag: 'New Application', tagColor: 'bg-green-600', avatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxybaUaqtLxUbBoOU5L89nfEiq9YhGphPINg&s' },
    { name: 'Devanshi Saini', action: 'completed the', actionPrefix: 'has', detail: 'coding assessment', time: '5 hours ago', tag: 'Assessment', tagColor: 'bg-indigo-600' , avatar:'https://img.freepik.com/premium-photo/portrait-young-indian-woman-happy-with-internship-human-resources-opportunity-mission-vision-company-values-goals-face-headshot-gen-z-person-with-hr-job-about-us-faq_590464-134290.jpg' },
    { name: 'Utkarsh Singh', action: 'Ethan Harper', detail: 'scheduled', time: 'Yesterday', tag: 'Interview', tagColor: 'bg-purple-600',avatar: 'https://www.shutterstock.com/image-photo/head-shot-portrait-millennial-30s-260nw-2555494759.jpg' },
  ];

  const StatCard = ({ title, value, link, icon }) => (
    // Changed bg-[#1b2a47] to bg-[#1f2937] for a closer match to the image
    <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg flex flex-col justify-between h-40">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-300">{title}</h3>
        <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
          <path d={icon} />
        </svg>
      </div>
      <div className="mt-4">
        <p className="text-4xl font-extrabold text-white">{value}</p>
        <a 
          href={`${link}`} 
          className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center mt-1 transition-colors"
        >
          Go to {title.split(' ')[1]} &rarr;
        </a>
      </div>
    </div>
  );

  return (
    <div> 
      <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
      <p className="text-gray-400 mt-1 mb-8">Welcome back, your team's progress is looking great.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      {/* Recent Activity Card */}
      <div className="mt-10 bg-[#1f2937] p-6 rounded-xl shadow-lg">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
    <a href="#" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">View All</a>
  </div>
  
  <div className="space-y-4">
    {recentActivity.map((activity, index) => (
      <div 
        key={index} 
        className="flex justify-between items-center py-3 px-2 rounded-lg hover:bg-[#2e3b4d] transition-colors"
      >
        <div className="flex items-center">
          {/* Avatar */}
          <img 
            src={activity.avatar} 
            alt={activity.name} 
            className="w-9 h-9 rounded-full mr-4 object-cover" 
          />

          {/* Activity Text */}
          <div className="text-sm">
            <span className="text-white font-semibold">{activity.name}</span>
            <span className="text-gray-300"> {activity.actionPrefix} </span>
            <span className="text-white font-semibold">{activity.action}</span>
            <span className="text-gray-300"> {activity.detail}</span>
            <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
          </div>
        </div>
        
        {/* Tag */}
        <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${activity.tagColor}`}>
          {activity.tag}
        </span>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default DashboardPage;