import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/globals.css';

const Education = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const ewasteCategories = [
    {
      icon: '💻',
      name: 'Computers & Laptops',
      items: ['Desktop PCs', 'Laptops', 'Monitors', 'Keyboards', 'Mice'],
      hazards: ['Lead in CRT monitors', 'Mercury in LCD screens', 'Cadmium in batteries'],
      recycling: 'Remove batteries and hard drives before recycling. Data should be wiped securely.'
    },
    {
      icon: '📱',
      name: 'Mobile Devices',
      items: ['Smartphones', 'Tablets', 'Smartwatches', 'E-readers'],
      hazards: ['Lithium batteries', 'Rare earth metals', 'Toxic adhesives'],
      recycling: 'Factory reset device. Remove SIM cards. Check for trade-in programs.'
    },
    {
      icon: '📺',
      name: 'TVs & Displays',
      items: ['LED TVs', 'LCD monitors', 'Plasma screens', 'Projectors'],
      hazards: ['Lead', 'Mercury', 'Phosphor powder', 'Flame retardants'],
      recycling: 'Never dispose in regular trash. Contact certified e-waste recyclers.'
    },
    {
      icon: '🏠',
      name: 'Home Appliances',
      items: ['Refrigerators', 'Washing machines', 'Microwaves', 'Vacuum cleaners'],
      hazards: ['CFCs in cooling systems', 'Heavy metals', 'Plastic components'],
      recycling: 'Check for manufacturer take-back programs. Remove doors from old fridges.'
    },
    {
      icon: '🎮',
      name: 'Gaming & Entertainment',
      items: ['Game consoles', 'Controllers', 'VR headsets', 'Speakers'],
      hazards: ['Electronic components', 'Batteries', 'Plastic waste'],
      recycling: 'Consider donation if functional. Recycle batteries separately.'
    },
    {
      icon: '🔌',
      name: 'Cables & Accessories',
      items: ['Chargers', 'Cables', 'Adapters', 'Power banks'],
      hazards: ['Copper', 'Plastic insulation', 'Lithium in power banks'],
      recycling: 'Bundle cables together. Drop at e-waste collection points.'
    }
  ];

  const recyclingSteps = [
    {
      step: 1,
      title: 'Identify E-Waste',
      description: 'Check if your item is electronic waste',
      icon: '🔍'
    },
    {
      step: 2,
      title: 'Data Safety',
      description: 'Wipe personal data and remove storage',
      icon: '🔒'
    },
    {
      step: 3,
      title: 'Find Collection Center',
      description: 'Locate nearest certified e-waste center',
      icon: '📍'
    },
    {
      step: 4,
      title: 'Proper Drop-off',
      description: 'Deliver to authorized recycling facility',
      icon: '♻️'
    }
  ];

  const impactStats = [
    { value: '50M+', label: 'Tons of E-Waste Yearly', icon: '⚠️' },
    { value: '20%', label: 'Currently Recycled', icon: '♻️' },
    { value: '$62B', label: 'Raw Materials Lost', icon: '💰' },
    { value: '80%', label: 'Ends in Landfills', icon: '🗑️' }
  ];

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      {/* Hero Section */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '2.5rem', fontWeight: '700' }}>
          📚 E-Waste Education Center
        </h1>
        <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9 }}>
          Learn how to properly handle and recycle electronic waste
        </p>
        <Link to="/dashboard" style={{
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.75rem 2rem',
          backgroundColor: 'white',
          color: '#667eea',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: '600'
        }}>
          ← Back to Dashboard
        </Link>
      </header>

      {/* Impact Stats */}
      <div style={{
        maxWidth: '1200px',
        margin: '-3rem auto 2rem',
        padding: '0 2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {impactStats.map((stat, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <h3 style={{ margin: '0.5rem 0', color: '#667eea', fontSize: '2rem' }}>{stat.value}</h3>
              <p style={{ margin: 0, color: '#666' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '2px solid #e0e0e0',
          overflowX: 'auto'
        }}>
          {['overview', 'categories', 'process', 'tips'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === tab ? '#667eea' : '#666',
                borderBottom: activeTab === tab ? '3px solid #667eea' : 'none',
                fontWeight: activeTab === tab ? '700' : '500',
                fontSize: '1rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ color: '#1a252f', marginTop: 0 }}>What is E-Waste?</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555' }}>
              Electronic waste (e-waste) refers to discarded electrical or electronic devices. Used electronics which are destined for refurbishment, reuse, resale, salvage recycling through material recovery, or disposal are also considered e-waste.
            </p>
            
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ color: '#667eea' }}>Why E-Waste Matters</h3>
              <ul style={{ fontSize: '1.05rem', lineHeight: '2', color: '#555' }}>
                <li>🌍 E-waste is the fastest-growing waste stream globally</li>
                <li>☠️ Contains toxic materials that harm environment and health</li>
                <li>💎 Contains valuable materials like gold, silver, and copper</li>
                <li>🔄 Proper recycling can recover up to 95% of materials</li>
                <li>🌱 Reduces need for mining new raw materials</li>
              </ul>
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px', borderLeft: '4px solid #ffc107' }}>
              <strong>⚠️ Did You Know?</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>
                Only 17.4% of e-waste was collected and recycled in 2019. The rest ended up in landfills, was burned, or recycled informally, causing environmental and health hazards.
              </p>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {ewasteCategories.map((category, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{category.icon}</div>
                <h3 style={{ color: '#667eea', margin: '0 0 1rem 0' }}>{category.name}</h3>
                
                <h4 style={{ color: '#333', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Common Items:</h4>
                <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.5rem', color: '#666' }}>
                  {category.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>

                <h4 style={{ color: '#dc3545', fontSize: '0.9rem', marginBottom: '0.5rem' }}>⚠️ Hazardous Materials:</h4>
                <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
                  {category.hazards.map((hazard, i) => (
                    <li key={i}>{hazard}</li>
                  ))}
                </ul>

                <div style={{ padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '6px', marginTop: '1rem' }}>
                  <strong style={{ color: '#0056b3', fontSize: '0.9rem' }}>♻️ Recycling Tip:</strong>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#555' }}>{category.recycling}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Process Tab */}
        {activeTab === 'process' && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ color: '#1a252f', marginTop: 0 }}>E-Waste Recycling Process</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
              {recyclingSteps.map((item) => (
                <div key={item.step} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 1rem',
                    borderRadius: '50%',
                    backgroundColor: '#667eea',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }}>
                    {item.icon}
                  </div>
                  <h3 style={{ color: '#667eea', margin: '0 0 0.5rem 0' }}>Step {item.step}</h3>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{item.title}</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>{item.description}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '3rem' }}>
              <h3 style={{ color: '#667eea' }}>What Happens at Recycling Facilities?</h3>
              <ol style={{ fontSize: '1.05rem', lineHeight: '2', color: '#555' }}>
                <li><strong>Collection & Transportation:</strong> E-waste is collected from drop-off centers</li>
                <li><strong>Sorting & Categorization:</strong> Items are manually sorted by type and material</li>
                <li><strong>Dismantling:</strong> Devices are disassembled to separate components</li>
                <li><strong>Material Extraction:</strong> Metals, plastics, and glass are separated</li>
                <li><strong>Purification:</strong> Materials are refined for reuse in manufacturing</li>
                <li><strong>Safe Disposal:</strong> Hazardous materials are disposed of properly</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ color: '#1a252f', marginTop: 0 }}>Best Practices & Tips</h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#28a745' }}>✅ Do's</h3>
              <ul style={{ fontSize: '1.05rem', lineHeight: '2', color: '#555' }}>
                <li>Back up important data before recycling</li>
                <li>Remove batteries and store separately</li>
                <li>Factory reset devices to erase personal information</li>
                <li>Keep original packaging for easier recycling</li>
                <li>Donate working electronics instead of discarding</li>
                <li>Use certified e-waste recyclers only</li>
                <li>Check manufacturer take-back programs</li>
                <li>Keep cables and chargers bundled together</li>
              </ul>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#dc3545' }}>❌ Don'ts</h3>
              <ul style={{ fontSize: '1.05rem', lineHeight: '2', color: '#555' }}>
                <li>Never throw e-waste in regular trash bins</li>
                <li>Don't burn electronic devices</li>
                <li>Avoid informal recyclers without certification</li>
                <li>Don't disassemble batteries or CRT monitors</li>
                <li>Never pour liquids on electronic devices</li>
                <li>Don't mix e-waste with regular recyclables</li>
                <li>Avoid storing old electronics indefinitely</li>
              </ul>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: '#d4edda', borderRadius: '8px', borderLeft: '4px solid #28a745' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#155724' }}>💡 Pro Tips for Extended Device Life</h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#155724' }}>
                <li>Use surge protectors to prevent electrical damage</li>
                <li>Keep devices clean and dust-free</li>
                <li>Update software regularly for better performance</li>
                <li>Use protective cases and screen guards</li>
                <li>Avoid extreme temperatures and humidity</li>
                <li>Replace batteries when performance degrades</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Education;