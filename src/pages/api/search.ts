import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());
export async function GET({ params, request }: any) {
	const url = new URL(request.url);
	const query = url.searchParams.get("q");
	console.log("Query: ", query);
	const browser = await puppeteer.launch({
		headless: false,
		slowMo: 50,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});
	const page = await browser.newPage();
	await page.setUserAgent(
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
	);
	await page.goto(`https://duckduckgo.com/?q=${query}`);
	const htmlContent = await page.content();
	// const results = await page.evaluate(() =>
	// 	Array.from(document.querySelectorAll(".react-results--main")).map((el) => ({
	// 		html: el.innerHTML,
	// 	}))
	// );

	// await browser.close();

	return new Response(htmlContent, { status: 200 });
}
