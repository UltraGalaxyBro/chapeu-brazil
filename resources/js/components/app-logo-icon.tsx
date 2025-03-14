import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img 
            src="/images/logo-icon.svg" 
            alt="Chapéu Brazil logo"
            {...props}
            style={{
                width: props.width || 'auto',
                height: props.height || 'auto',
                ...props.style
            }}
        />
    );
}