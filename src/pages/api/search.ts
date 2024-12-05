import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());
export async function GET({ params, request }: any) {
	const url = new URL(request.url);
	const query = url.searchParams.get("q");
	console.log("Query: ", query);
	return new Response(JSON.stringify(await scrapContent(query || "")), { status: 200 });
}
export async function scrapContent(query: string) {
	const browser = await puppeteer.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});
	const page = await browser.newPage();
	await page.setUserAgent(
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
	);
	await page.goto(`https://duckduckgo.com/?q=${query}`);
	const htmlContent = await page.content();
	const results = await page.evaluate(() =>
		Array.from(document.querySelectorAll(".react-results--main li[data-layout='organic']")).map((el) => {
			const image: HTMLImageElement | null = el.querySelector("article > *:nth-child(2) > div > span > a > div > img");

			return {
				title: el.querySelector("article > *:nth-child(3) h2 span")?.innerHTML,
				description: el.querySelector("article > *:nth-child(4) span > span")?.innerHTML,
				url: el.querySelector("article > *:nth-child(2) > div > div > a > div > *:nth-child(1)")?.innerHTML,
				link: el.querySelector("article > *:nth-child(3) h2 > a")?.getAttribute("href"),
				image: image?.src,
			}
		})
	);

	await browser.close();

	return results;
}