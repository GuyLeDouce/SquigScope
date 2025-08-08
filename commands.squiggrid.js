import { SlashCommandBuilder } from 'discord.js';
import fetch from 'node-fetch';
import generateGrid from '../utils/generateGrid.js';

export default {
  data: new SlashCommandBuilder()
    .setName('squiggrid')
    .setDescription('Generate a Squigs grid from a wallet.')
    .addStringOption(option =>
      option.setName('wallet')
        .setDescription('Ethereum wallet address')
        .setRequired(true)),
  async execute(interaction) {
    const wallet = interaction.options.getString('wallet');
    await interaction.deferReply();

    const baseURL = `https://worldchain-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`;
    const response = await fetch(`${baseURL}/getNFTs/?owner=${wallet}&contractAddresses[]=${process.env.SQUIGS_CONTRACT}`);
    const data = await response.json();

    if (!data.ownedNfts || data.ownedNfts.length === 0) {
      return interaction.editReply('No Squigs found in that wallet.');
    }

    const tokenIds = data.ownedNfts.map(nft => parseInt(nft.id.tokenId, 16));
    const imageUrls = tokenIds.map(id =>
      `https://assets.bueno.art/images/a49527dc-149c-4cbc-9038-d4b0d1dbf0b2/default/${id}`);

    const buffer = await generateGrid(imageUrls);

    await interaction.editReply({
      content: `Here's your Squigs grid!`,
      files: [{ attachment: buffer, name: 'squigs-grid.png' }]
    });
  }
};
