import React, { useState, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CurrencyInputProps {
    id: string;
    label?: string;
    value: number | undefined;
    onChange: (value: number) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
    id,
    label,
    value,
    onChange,
    placeholder = "R$ 0,00",
    className = "",
    required = false,
    disabled = false
}) => {
    const [amountInCents, setAmountInCents] = useState<number>(0);

    const formatDisplay = (cents: number): string => {
        const value = cents / 100;
        return value.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    useEffect(() => {
        if (value !== undefined) {
            setAmountInCents(Math.round(value * 100));
        } else {
            setAmountInCents(0);
        }
    }, [value]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (
            e.key === 'Tab' || 
            e.key === 'Escape' || 
            e.key === 'Backspace' || 
            e.key === 'Delete' || 
            e.ctrlKey || 
            e.metaKey
        ) {
            if (e.key === 'Backspace') {
                e.preventDefault();
                const newAmount = Math.floor(amountInCents / 10);
                setAmountInCents(newAmount);
                onChange(newAmount / 100);
            }
            return;
        }

        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
            return;
        }

        e.preventDefault();
        
        if (amountInCents >= 1000000000) return;
        
        const digit = parseInt(e.key, 10);
        const newAmount = amountInCents * 10 + digit;
        setAmountInCents(newAmount);
        onChange(newAmount / 100);
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const clipboardData = e.clipboardData.getData('text');
        const numericValue = clipboardData.replace(/[^\d]/g, '');
        
        if (numericValue) {
            const newAmount = Math.min(parseInt(numericValue), 1000000000);
            setAmountInCents(newAmount);
            onChange(newAmount / 100);
        }
    };

    return (
        <div className={className}>
            {label && <Label htmlFor={id}>{label}</Label>}
            <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                <Input
                    id={id}
                    value={formatDisplay(amountInCents)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    readOnly
                    placeholder={placeholder}
                    className="pl-8 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required={required}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

export default CurrencyInput;