import React from 'react';

const History = ({ scans }) => {
    // If App.jsx is still loading, scans might be empty initially
    if (!scans || scans.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-400 italic">No food scans found yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {scans.map((scan) => (
                <div 
                    key={scan._id} 
                    className="group bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all border-l-4"
                    style={{ borderLeftColor: scan.isHealthy ? '#10B981' : '#EF4444' }}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-bold text-gray-800">{scan.foodName}</h4>
                            <p className="text-[10px] text-gray-400 font-mono">
                                {new Date(scan.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                            scan.isHealthy ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                            {scan.isHealthy ? 'Safe' : 'Conflict'}
                        </span>
                    </div>

                    <div className="flex gap-3 my-3">
                        <div className="flex-1 bg-gray-50 p-2 rounded text-center">
                            <p className="text-xs font-bold text-gray-700">{scan.macros.calories}</p>
                            <p className="text-[8px] text-gray-400 uppercase">Kcal</p>
                        </div>
                        <div className="flex-1 bg-gray-50 p-2 rounded text-center">
                            <p className="text-xs font-bold text-gray-700">{scan.macros.protein}g</p>
                            <p className="text-[8px] text-gray-400 uppercase">Prot</p>
                        </div>
                        <div className="flex-1 bg-gray-50 p-2 rounded text-center">
                            <p className="text-xs font-bold text-gray-700">{scan.macros.carbs}g</p>
                            <p className="text-[8px] text-gray-400 uppercase">Carb</p>
                        </div>
                    </div>

                    <p className="text-[11px] text-gray-500 line-clamp-2 italic group-hover:line-clamp-none transition-all">
                        "{scan.reasoning}"
                    </p>
                </div>
            ))}
        </div>
    );
};

export default History;