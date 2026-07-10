import React from 'react'

interface ScoreDistributionProps {
  data: {
    correct: number
    incorrect: number
    unattempted: number
  }
}



export const ScoreDistributionChart: React.FC<ScoreDistributionProps> = ({ data }) => {
  const total = data.correct + data.incorrect + data.unattempted
  const correctPercent = (data.correct / total) * 100
  const incorrectPercent = (data.incorrect / total) * 100
  const unattemptedPercent = (data.unattempted / total) * 100

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Score Distribution</h3>
      
      {/* Donut Chart */}
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray={`${correctPercent}, 100`}
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeDasharray={`${incorrectPercent}, 100`}
            strokeDashoffset={-correctPercent}
          />
          {data.unattempted > 0 && (
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="3"
              strokeDasharray={`${unattemptedPercent}, 100`}
              strokeDashoffset={-(correctPercent + incorrectPercent)}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-800">{data.correct}/{total}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span>Correct</span>
          </div>
          <span className="font-medium">{data.correct}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span>Incorrect</span>
          </div>
          <span className="font-medium">{data.incorrect}</span>
        </div>
        {data.unattempted > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded mr-2"></div>
              <span>Unattempted</span>
            </div>
            <span className="font-medium">{data.unattempted}</span>
          </div>
        )}
      </div>
    </div>
  )
}

interface DifficultyAccuracyProps {
  data: {
    easy: number
    medium: number
    hard: number
  }
}

export const DifficultyAccuracyChart: React.FC<DifficultyAccuracyProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Difficulty-wise Accuracy</h3>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Easy</span>
            <span className="font-medium">{data.easy}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data.easy}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Medium</span>
            <span className="font-medium">{data.medium}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data.medium}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Hard</span>
            <span className="font-medium">{data.hard}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data.hard}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface TopicAccuracyProps {
  data: Array<{
    topic: string
    accuracyPercent: number
  }>
}

export const TopicAccuracyChart: React.FC<TopicAccuracyProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Topic-wise Performance</h3>
      
      <div className="space-y-3">
        {data.map((topic, index) => (
          <div key={index}>
            <div className="flex justify-between text-xs mb-1">
              <span className="truncate">{topic.topic}</span>
              <span className="font-medium">{topic.accuracyPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  topic.accuracyPercent >= 70 ? 'bg-green-500' :
                  topic.accuracyPercent >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${topic.accuracyPercent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}