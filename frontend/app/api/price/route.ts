export async function GET() {
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
  const data = await res.json();

  return new Response(
    JSON.stringify({
      ethereum: {
        usd: data.ethereum.usd,
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

