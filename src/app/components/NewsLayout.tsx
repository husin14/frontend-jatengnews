import React from "react";
import Sidebar from "@/app/components/sideBar";

interface NewsLayoutProps {
  title: string;
  children: React.ReactNode;
  pagination?: React.ReactNode;
  lang?: "id" | "en";
}

export const NewsLayout: React.FC<NewsLayoutProps> = ({
  title,
  children,
  pagination,
  lang = "id",
}) => {
  return (
    <div className="row clearfix" style={{ marginTop: "0px" }}>
      <div className="col-lg-8">
        <div className="mt-0">
          <div className="row col-mb-50">
            <div className="col-12">
              <div className="mb-2 ls1 text-uppercase fw-bold">
                <h3>{title}</h3>
                <div className="line line-xs line-sports"></div>
              </div>
              {children}
            </div>
          </div>
          {pagination}
        </div>
      </div>
      <Sidebar marginTop="35.17px" lang={lang} />
    </div>
  );
};

export default NewsLayout;
