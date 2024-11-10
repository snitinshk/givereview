import { ChannelDB, Channel } from "@/interfaces/channels"

export const mapChannels = (channels: ChannelDB[]): Channel[] => {
    return channels?.map((channel) => {
        return {
            id: channel.id as number,
            name: channel?.channel_name ?? '',
            logo: channel?.channel_logo_url ?? '',
            logoId: channel?.channel_logo_id ?? ''
        }
    })
}