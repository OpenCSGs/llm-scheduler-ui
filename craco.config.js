module.exports = {
    webpack: {
        configure: {
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        resolve: {
                            fullySpecified: false
                        }
                    }
                ]
            }
        },
        devServer: {
            host: '0.0.0.0',
            disableHostCheck: true
        },
        headers: {
            'X-Frame-Options': 'ALLOWALL'
        }
    }
}
