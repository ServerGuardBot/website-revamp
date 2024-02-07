import createNextIntlPlugin from 'next-intl/plugin';
import webpack from "webpack";
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.plugins.push(
            webpack.DefinePlugin({
                "SECRET": process.env.SECRET,
                "TURNSTILE_KEY": process.env.TURNSTILE_KEY,
            })
        );
    }
};
 
export default withNextIntl(nextConfig);
