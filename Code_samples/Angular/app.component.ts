import { Component } from '@angular/core';
import { OpenApiService } from './services/open-api.service';
import { Dataset } from './models/dataset.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'openApiClient';
  sourceId = 'nokkel';
  tableId = 1;
  data!: Observable<Dataset>;

  constructor(
    private openApiService: OpenApiService,
  ) {}

  sources = this.openApiService.getSources()
  tables = this.openApiService.getTables(this.sourceId)
  metadata = this.openApiService.getMetadata(this.sourceId, this.tableId)
  dimensions = this.openApiService.getDimensions(this.sourceId, this.tableId)
  flags = this.openApiService.getFlags(this.sourceId, this.tableId)

  query = this.openApiService.getQuery(this.sourceId, this.tableId).subscribe((query) => {
    this.data = this.openApiService.getData(this.sourceId, this.tableId, query)
  })
}
