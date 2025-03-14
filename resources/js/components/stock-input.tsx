import React, { useState, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StockInputProps {
    id: string;
    label?: string;
    value: number | undefined;
    onChange: (value: number) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
    index?: number;
}

const StockInput: React.FC<StockInputProps> = ({
    id,
    label,
    value,
    onChange,
    placeholder = "0",
    required = false,
    disabled = false,
    index
}) => {
    const [stockValue, setStockValue] = useState<number>(0);

    // Sincroniza com props externas
    useEffect(() => {
        if (value !== undefined) {
            setStockValue(value);
        } else {
            setStockValue(0);
        }
    }, [value]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (
            e.key === 'Tab' || 
            e.key === 'Escape' || 
            e.ctrlKey || 
            e.metaKey
        ) {
            return;
        }

        e.preventDefault();

        if (e.key === 'Backspace' || e.key === 'Delete') {
            const newValue = Math.floor(stockValue / 10);
            setStockValue(newValue);
            onChange(newValue);
            return;
        }

        if (!/^\d$/.test(e.key)) {
            return;
        }
        
        if (stockValue >= 99999) return;
        
        const digit = parseInt(e.key, 10);
        const newValue = stockValue * 10 + digit;
        setStockValue(newValue);
        onChange(newValue);
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const clipboardData = e.clipboardData.getData('text');
        const numericValue = clipboardData.replace(/[^\d]/g, '');
        
        if (numericValue) {
            const newValue = Math.min(parseInt(numericValue), 99999);
            setStockValue(newValue);
            onChange(newValue);
        }
    };

    return (
        <>
            {label && <Label htmlFor={id} className="mb-2">{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>}
            <Input
                id={id}
                value={stockValue}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                readOnly
                placeholder={placeholder}
                className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required={required}
                disabled={disabled}
            />
        </>
    );
};

export default StockInput;