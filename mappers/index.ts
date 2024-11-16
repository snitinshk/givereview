import { ChannelDB, Channel } from "@/interfaces/channels"
import { ClientDB } from "@/interfaces/clients"
import { format } from 'date-fns';

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

export const mapClients = (clients: ClientDB[]) => {
    return clients?.map((client) => {
        return {
            id: client.id as number,
            name: client?.client_name ?? '',
            logo: client?.client_logo ?? '',
            type: client?.client_type ?? '',
            nrOfLinks: 2,
            createdAt: client?.created_at,
            status: client?.client_status

        }
    })
}