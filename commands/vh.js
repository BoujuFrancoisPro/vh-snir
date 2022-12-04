const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const ping = require('ping');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vh')
        .setDescription('Valheim server management')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('start the valheim server'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Query valheim server infos')),
    async execute(interaction) {

        const started = new MessageEmbed()
            .setColor('#42f56')
            .setTitle('Snir-vh start')
            .setDescription('🟢 Server started :tangelepd:')
            .setThumbnail('https://styles.redditmedia.com/t5_3y3u35/styles/communityIcon_88gowgg55vh61.png?width=256&s=9a9641b4cd2f0fcd322a90166ca609cece04b918')
            .addFields(
                { name: ':satellite: Join @', value: ' - vh.francoisbouju.fr', inline: true },
            )
            .setTimestamp();

        const starting = new MessageEmbed()
            .setColor('#ffa50a')
            .setTitle('Snir-vh start')
            .setDescription(':orange_circle: Server started :tangelepd:')
            .setThumbnail('https://styles.redditmedia.com/t5_3y3u35/styles/communityIcon_88gowgg55vh61.png?width=256&s=9a9641b4cd2f0fcd322a90166ca609cece04b918')
            .addFields(
                { name: 'The server is starting', value: 'Let the potato rest for 2 minutes', inline: true },
            )
            .setTimestamp();

        const startErr = new MessageEmbed()
            .setColor('#fc0000')
            .setTitle('Snir-vh start')
            .setDescription('🔴 Error starting :triggered:')
            .setThumbnail('https://styles.redditmedia.com/t5_3y3u35/styles/communityIcon_88gowgg55vh61.png?width=256&s=9a9641b4cd2f0fcd322a90166ca609cece04b918')
            .addFields(
                { name: 'Shit hit the fan', value: 'Contact Achozen#5311 ASAP', inline: true },
            )
            .setTimestamp();

        const statusDown = new MessageEmbed()
            .setColor('#fc0000')
            .setTitle('Snir-vh status')
            .setDescription('🔴 The server is currently Offline :bernard:')
            .setThumbnail('https://styles.redditmedia.com/t5_3y3u35/styles/communityIcon_88gowgg55vh61.png?width=256&s=9a9641b4cd2f0fcd322a90166ca609cece04b918')
            .addFields(
                { name: ':keyboard: Use :', value: '/vh start :frConseil:', inline: true },
            )
            .setTimestamp();

        

        //start Subcommand
        if (interaction.options.getSubcommand() === 'start') {
            await interaction.deferReply();

            await interaction.editReply({ embeds: [starting] });

            try {
                const response = await axios.get('http://10.13.13.2:5000/start-server/');
                if(response){
                    let resPing = await ping.promise.probe('10.13.13.5', {timeout: 2, deadline: 120});
                    if(resPing.alive){
                        await interaction.editReply({ embeds: [started] });
                    }else{
                        await interaction.editReply({ embeds: [startErr] });
                    }
                }else{
                    await interaction.editReply({ embeds: [startErr] });
                }
            }catch(e){
                console.log(e);
                await interaction.editReply({ embeds: [startErr] });
            }
        }

        //stop Subcommand
        if (interaction.options.getSubcommand() === 'status') {

            try{
                const SteamResponse = await axios.get('http://10.13.13.5:9999/status.json',{timeout : 2000});

                let serverName = SteamResponse.data.server_name;
                let playerCount = SteamResponse.data.player_count;
                let playersArray = SteamResponse.data.players;
                let status = SteamResponse.data.error

                console.log(status)
                //If server is up
                if(status == null){
                    const statusUp = new MessageEmbed()
                        .setColor('#42f569')
                        .setTitle('Snir-vh status')
                        .setDescription('🟢 The server is currently Online. :gwendal:')
                        .setThumbnail('https://styles.redditmedia.com/t5_3y3u35/styles/communityIcon_88gowgg55vh61.png?width=256&s=9a9641b4cd2f0fcd322a90166ca609cece04b918')
                        .addFields(
                            { name: ':satellite: Join @', value: 'vh.francoisbouju.fr', inline: true },
                            { name: ':lock: Password', value: 'Contact Achozen#5311 for access', inline: true },
                            { name: ':scroll: Server Name :', value: ''+serverName, inline: false },
                            { name: ':frConseil: Player Count : ', value: ''+playerCount+'/10', inline: false },
                            //{ name: 'Players : ', value: 'Not  implemented by steam', inline: true },
                        )
                        .setTimestamp();

                    await interaction.reply({ embeds: [statusUp] });
                }else{
                    if(SteamResponse.data != undefined){
                        await interaction.reply({ embeds: [statusDown] });
                    }
                }
            }catch(e){
                console.log(e);
                await interaction.reply({embeds: [statusDown]});
            }
        }
    },
};