import prisma from "../../Admin/utilities/prismaclient";
import { emitCoinsUpdated } from "../../sockets/socketManager";

export async function updateCoinsBalance(userId: number, incrementAmount: number): Promise<any> {
    try {
      const existingCoins = await prisma.allCoins.findUnique({
        where: {
          userId: userId,
        },
      });
  
      let updatedCoins;
      if (existingCoins) {
        updatedCoins = await prisma.allCoins.update({
          where: {
            userId: userId,
          },
          data: {
            balance: {
              increment: incrementAmount,
            },
          },
        });
      } else {
        updatedCoins = await prisma.allCoins.create({
          data: {
            userId: userId,
            balance: incrementAmount,
          },
        });
      }
  
      // Emit Socket.IO event after updating the balance
      emitCoinsUpdated(userId, updatedCoins.balance);
  
      return updatedCoins;
    } catch (error:any) {
      throw new Error(`Failed to update coins balance: ${error.message}`);
    }
  }
  

  export async function getCoinsBalance(userId: number): Promise<any> {
    try {
      const coins = await prisma.allCoins.findUnique({
        where: {
          userId: userId,
        },
      });
  
      if (!coins) {
        throw new Error('Coins not found for the user');
      }
  
      return coins;
    } catch (error: any) {
      throw new Error(`Failed to fetch coins balance: ${error.message}`);
    }
  }
  
