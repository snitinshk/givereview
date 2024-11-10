export const mapChannels = (channels) => {
    return channels?.map((channel) => {
        return {
            id: channel.id,
            name: channel.channel_name,
            logo: channel.channel_logo_url,
        }
    })
}

