import { MOCK_DASHBOARD_STATS, MOCK_PRESIDENTIAL_RESULTS, NIGERIA_STATES } from '../../services/mockData';
import StatCard from '../../components/ui/StatCard';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import { formatNumber } from '../../utils/helpers';

const totalVotes = MOCK_PRESIDENTIAL_RESULTS.reduce((s,c)=>s+c.votes,0);

export default function AdminDashboard() {
  const recentActivity = [
    { action:'Results uploaded', state:'Lagos', time:'2 mins ago',    status:'success' },
    { action:'New user registered', state:'Kano', time:'5 mins ago',  status:'info' },
    { action:'Upload failed',     state:'Kogi',  time:'12 mins ago',  status:'error' },
    { action:'Results verified',  state:'Rivers',time:'18 mins ago',  status:'success' },
    { action:'Results uploaded',  state:'Abuja', time:'24 mins ago',  status:'success' },
  ];
  const statusColor = { success:'var(--inec-green)', error:'var(--inec-red)', info:'var(--inec-blue)' };

  return (
    <div>
      <div style={{marginBottom:'1.5rem'}}>
        <h3 style={{color:'var(--inec-grey-900)'}}>Admin Overview</h3>
        <p style={{color:'var(--inec-grey-500)',fontSize:'0.875rem'}}>Real-time summary of election data and system activity</p>
      </div>

      <div className="stat-cards-grid">
        <StatCard icon="🗳️" label="Total Votes Cast"     value={formatNumber(MOCK_DASHBOARD_STATS.totalVotesCast)} change="Live" changeDir="up"   colorClass="green" />
        <StatCard icon="📤" label="Results Uploaded"     value={`${MOCK_DASHBOARD_STATS.uploadPercentage}%`}       change="+2.1%" changeDir="up"  colorClass="blue" />
        <StatCard icon="👥" label="Registered Voters"    value={formatNumber(MOCK_DASHBOARD_STATS.totalRegistered)} colorClass="yellow" />
        <StatCard icon="🏛️" label="Polling Units Active" value={formatNumber(MOCK_DASHBOARD_STATS.totalPollingUnits)} colorClass="green" />
      </div>

      <div className="content-grid-2">
        <div className="card">
          <div className="card-header"><h4>Vote Distribution by Candidate</h4></div>
          <div className="card-body"><BarChart data={MOCK_PRESIDENTIAL_RESULTS} /></div>
        </div>
        <div className="card">
          <div className="card-header"><h4>Party Vote Share</h4></div>
          <div className="card-body"><PieChart data={MOCK_PRESIDENTIAL_RESULTS} /></div>
        </div>
      </div>

      <div className="content-grid-2" style={{marginTop:'1.5rem'}}>
        {/* Upload Progress */}
        <div className="card">
          <div className="card-header"><h4>Upload Progress by Zone</h4></div>
          <div className="card-body">
            {[['South-West','92%','var(--inec-green)'],['North-West','87%','var(--inec-blue)'],['South-South','79%','var(--inec-yellow)'],['North-Central','74%','#8b5cf6'],['South-East','68%','#ec4899'],['North-East','61%','var(--inec-red)']].map(([zone,pct,color])=>(
              <div key={zone} style={{marginBottom:'1rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                  <span style={{fontSize:'0.875rem',fontWeight:600,color:'var(--inec-grey-700)'}}>{zone}</span>
                  <span style={{fontSize:'0.875rem',fontWeight:700,color}}>{pct}</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{width:pct,background:color}} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header"><h4>Recent Activity</h4></div>
          <div className="card-body" style={{padding:0}}>
            {recentActivity.map((a,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'0.875rem 1.5rem',borderBottom:'1px solid var(--inec-grey-100)'}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:statusColor[a.status],flexShrink:0}} />
                <div style={{flex:1}}>
                  <div style={{fontSize:'0.875rem',fontWeight:500,color:'var(--inec-grey-800)'}}>{a.action}</div>
                  <div style={{fontSize:'0.75rem',color:'var(--inec-grey-400)'}}>{a.state}</div>
                </div>
                <div style={{fontSize:'0.75rem',color:'var(--inec-grey-400)'}}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}