'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'

interface FloatingInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const FloatingInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  required = false, 
  className = "",
  prefix = null,
  suffix = null,
  ...props 
}: FloatingInputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value !== '' && value !== null && value !== undefined

  return (
    <div className={`relative group ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-r from-primary-gold/10 to-transparent opacity-0 transition-opacity duration-500 rounded-xl pointer-events-none ${isFocused ? 'opacity-100' : ''}`} />
      <div 
        className={`
          relative flex items-center bg-white/5 border rounded-xl overflow-hidden transition-all duration-300
          ${isFocused ? 'border-primary-gold ring-1 ring-primary-gold/30 bg-white/10 scale-[1.01]' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'}
        `}
      >
        {prefix && (
          <div className={`pl-4 transition-colors duration-300 ${isFocused ? 'text-primary-gold' : 'text-white/40'}`}>
            {prefix}
          </div>
        )}
        <div className="relative flex-1">
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full px-4 py-4 bg-transparent border-none outline-none text-white placeholder-transparent transition-all
              ${prefix ? 'pl-3' : ''}
              ${suffix ? 'pr-2' : ''}
              pt-6 pb-2 font-medium
            `}
            placeholder={label}
            required={required}
            {...props}
          />
          <label
            className={`
              absolute left-4 transition-all duration-300 pointer-events-none
              ${prefix ? 'left-3' : ''}
              ${isFocused || hasValue
                ? 'top-2 text-[10px] text-primary-gold font-bold uppercase tracking-wider transform-none'
                : 'top-1/2 -translate-y-1/2 text-white/40 font-normal text-base'}
            `}
          >
            {label}
          </label>
        </div>
        {suffix && (
          <div className="pr-3 pl-1">
            {suffix}
          </div>
        )}
      </div>
    </div>
  )
}

interface ModernSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

export const ModernSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options 
}: ModernSelectProps) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-r from-primary-gold/10 to-transparent opacity-0 transition-opacity duration-500 rounded-xl pointer-events-none ${isFocused ? 'opacity-100' : ''}`} />
      <div 
        className={`
          relative flex items-center bg-white/5 border rounded-xl overflow-hidden transition-all duration-300
          ${isFocused ? 'border-primary-gold ring-1 ring-primary-gold/30 bg-white/10' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.07]'}
        `}
      >
        <div className="relative flex-1">
           <select
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-4 py-4 bg-transparent border-none outline-none appearance-none text-white pt-6 pb-2 font-medium cursor-pointer [&>option]:bg-zinc-900"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <label
            className="absolute left-4 top-2 text-[10px] text-primary-gold font-bold uppercase tracking-wider pointer-events-none"
          >
            {label}
          </label>
          <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 ${isFocused ? 'rotate-180 text-primary-gold' : 'text-white/40'}`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

export const ModernCheckbox = ({ label, name, checked, onChange }: { label: string, name: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <label className="relative flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-white/5 transition-all cursor-pointer group overflow-hidden">
    <div className={`
      w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300
      ${checked 
        ? 'bg-primary-gold border-primary-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]' 
        : 'border-white/30 group-hover:border-white/60 bg-transparent'}
    `}>
      <Check className={`w-3.5 h-3.5 text-black font-bold transition-all duration-300 ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} strokeWidth={3} />
    </div>
    <span className={`font-medium transition-colors duration-300 ${checked ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}>
      {label}
    </span>
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="hidden"
    />
    {checked && (
      <motion.div 
        layoutId={`active-bg-${name}`}
        className="absolute inset-0 bg-white/5 rounded-xl -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
    )}
  </label>
)
