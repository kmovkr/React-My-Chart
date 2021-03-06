import React, { useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import { useSelector, useDispatch } from "react-redux";
import * as type from "../../Modules/bugs";
import ChartList, { chartProps } from "./ChartList";
import Loading from "./Loading";
import { RootState } from "../../Modules/index";

function Bugs() {
  const dispatch = useDispatch();
  const bugsChart = useSelector((state: RootState) => state.bugs.bugsChart);
  const isLoading = useSelector((state: RootState) => state.bugs.isLoading);
  const url =
    "https://cors-anywhere.herokuapp.com/https://music.bugs.co.kr/chart";

  const getChart = async () => {
    try {
      const top100 = await axios.get(url);
      setChart(top100);
    } catch (error) {
      console.error(error);
    }
  };

  const setChart = (html: AxiosResponse<any>) => {
    const chartList: chartProps[] = [];
    const $ = cheerio.load(html.data);
    const $titleList = $("th").children("p.title").children("a");
    const $artistList = $("td.left")
      .children("p.artist")
      .children("a:first-child");
    const $albumList = $("td").children("a.thumbnail").children("img");

    $titleList.each((i) => {
      chartList[i] = {
        title: $titleList[i].children[0].data?.trim(),
        artist: $artistList[i].children[0].data,
        album: $albumList[i].attribs.src,
      };
    });
    dispatch({
      type: type.INSERT,
      chart: chartList,
    });
  };

  useEffect(() => {
    document.title = "Bugs | MyChart";
    getChart();
    return () => {};
  }, []);

  return (
    <div className="container">
      {isLoading ? (
        Loading()
      ) : (
        <div className="container_chart">
          <p>
            <img src="/images/logo_bugs.png" alt="bugs 로고 이미지"></img>
          </p>
          {ChartList(bugsChart)}
        </div>
      )}
    </div>
  );
}

export default Bugs;
