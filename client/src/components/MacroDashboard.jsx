// client/src/components/MacroDashboard.jsx
import React from 'react';

const MacroBar = ({ label, current, goal, color }) => {
  // Calculate percentage (clamped at 100%)
  const percentage = Math.min((current / goal) * 100, 100);
  const isOver = current > goal;

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">
          {current}g / {goal}g
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out ${isOver ? 'bg-red-500' : color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {isOver && <p className="text-xs text-red-500 mt-1">Goal Exceeded!</p>}
    </div>
  );
};

const MacroDashboard = ({ dailyTotals, goals }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6 text-center text-blue-600">Daily Macro Progress</h2>
      
      <MacroBar 
        label="Protein" 
        current={dailyTotals.protein} 
        goal={goals.protein} 
        color="bg-blue-500" 
      />
      <MacroBar 
        label="Carbs" 
        current={dailyTotals.carbs} 
        goal={goals.carbs} 
        color="bg-green-500" 
      />
      <MacroBar 
        label="Fats" 
        current={dailyTotals.fats} 
        goal={goals.fats} 
        color="bg-yellow-500" 
      />
      
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <p className="text-gray-500 text-sm italic">
          "Based on your {goals.dietType} profile"
        </p>
      </div>
    </div>
  );
};

export default MacroDashboard;