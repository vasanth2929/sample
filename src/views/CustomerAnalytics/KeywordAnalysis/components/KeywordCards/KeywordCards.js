import { Card, CardContent, LinearProgress } from '@material-ui/core';
import React from 'react';
import './KeywordCards.style.scss';

const DEFAULT_CLASSNAME = 'keyword-card';

export default function KeywordCards({ title = 'Pain point' }) {
  return (
    <div className={`${DEFAULT_CLASSNAME}`}>
      <Card>
        <div className={`${DEFAULT_CLASSNAME}-header`}>
          <div className="title">{title}</div>
        </div>
        <CardContent>
          {[1, 2, 3, 4, 5].map((i) => (
            <div className="keyword-container">
              <div>
                <span
                  className={`material-icons pushpin ${
                    i == 3 ? 'selected' : ''
                  }`}
                >
                  push_pin
                </span>
              </div>
              <div className="keyword">
                keyword
                <div>
                  <LinearProgress
                    color="secondary"
                    variant="determinate"
                    value={i * 10}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
